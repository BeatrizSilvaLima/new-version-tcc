import Monitored from 'App/Models/Monitored'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import TwitterService from 'App/Services/TwitterService'
import Database from '@ioc:Adonis/Lucid/Database'
import Message from "App/Models/Message";
import natural from "natural";

class MonitoredService {
  public static async postFollow({ request, session, auth }) {

    const monitored = await Monitored.query().where('user_name','=',request.all().userName).andWhere('social_media', '=', request.all().socialMedia)

    if(monitored.length) {
      await monitored[0].related('user').sync({
        [auth.user.id]: {
          active: true
        }
      }, false)

      return;
    }

    request.all().monitoredId = await TwitterService.getUser(request.all().userName)
    const postSchema = schema.create({
      monitoredId: schema.number([
        rules.unique({
          table: 'monitoreds',
          column: 'external_id',
        }),
        rules.required(),
      ]),
      socialMedia: schema.string({}, [rules.required()]),
      monitorId: schema.number([rules.required()]),
    })
    const messages = {
      'monitoredId.required': 'Usuário não encontrado',
      'monitoredId.unique': 'Usuário já é monitorado',
      'socialMedia.required': 'Informe a rede social do usuário a ser monitorado',
      'monitorId.required': 'Você precisa estar logado para monitorar uma pessoa',
    }
    try {
      await validator.validate({ schema: postSchema, data: request.all(), messages: messages })
    } catch (error) {
      session.flash('message', error.messages)
    }
    await (await Monitored.updateOrCreate(
      {
        externalId: request.all().monitoredId,
        socialMedia: request.all().socialMedia,
      },
      {
        externalId: request.all().monitoredId,
        socialMedia: request.all().socialMedia,
        userName: request.all().userName,
      }
    )).related('user').sync({
      [auth.user.id]: {
        active: true
      }
    }, false)
    
  }
  public static async updateFilter({request, auth}) {
    const teste = await Database.query()
      .update('filter',request.all().filter)
      .from('users')
      .where('id','=',auth.user.id)

    return teste
  }
  public static async getFollow({ auth }) {
    const rawMonitored = await Monitored.query().select('*').preload('user').whereHas('user', query => {
      query.where('user_id', '=', auth.user.id).andWhere('active', '=', true)
    })

    const monitored = rawMonitored.map((item) => {
      return {
        id: item.id,
        userName: item.userName,
        socialMedia: item.socialMedia,
        userId: item.$preloaded.user[0].$attributes.id

      }
    })
    /*const monitored = await Database.query()
      .select('*')
      .from('monitoreds')
      .where('monitor_id', '=', auth.user.id)
      .andWhere('active', '=', true)*/
    return monitored
  }
  public static async getAllFollowed(socialMedia) {
    const monitored = await Monitored.query().select(['external_id','last_message_id','social_media','id','user_name']).preload('user').distinct(['external_id', 'social_media']).whereHas('user', query => {
      query.where('active', '=', true)
    }).where('social_media', '=', socialMedia)

    monitored.map((item) => {
      return {
        id: item.id,
        userName: item.userName,
        socialMedia: item.socialMedia,
        userId: item.$preloaded.user[0].$attributes.id

      }
    })
    /*const monitored = await Database.query()
      .select(['monitored_id','last_message_id','monitor_id','social_media','id','user_name'])
      .from('monitoreds')
      .where('active', '=', true)*/
    return monitored
  }

  public static async stopFollow({ request, auth }) {
    await (await Monitored.query().select().where('id', '=', request.all().monitoredId).andWhereHas('user', query => {
      query.where('user_id', '=', auth.user.id).andWhere('active', '=', true)}))[0]
      .related('user').sync({
      [auth.user.id]: {
        active: false
      }
    }, false)
  }

  public static async checkMessages({request, auth}) {

    await (await Message.query().select().where('id', '=', request.all().messageId).andWhereHas('users', query => {
      query.where('user_id', '=', auth.user.id)}))[0]
      .related('users').sync({
      [auth.user.id]: {
        checked: true
      }
    }, false)

  }

  public static async refreshTweets({auth}) {
    const monitoredList = await this.getFollow({auth})
    const monitoredId = monitoredList.map(function(monitored){
      return monitored.id
    })
    //const messages = await Database.query().select('*').from('messages').where('monitored_id','IN',monitoredId).orderBy('monitored_id', 'asc').orderBy('id_conversation', 'asc').orderBy('id_message', 'asc')

    const rawMessages = await Message.query().select('*').preload('users').whereHas('users', query => {
      query.where('user_id', '=', auth.user.id).andWhere('alert', '=', true).andWhere('checked', '=', false)
    }).andWhereHas('monitoreds', query => {
      query.where('id', 'in', monitoredId)
    })


    const messages = rawMessages.map((item) => {
      return {
        id: item.id,
        monitoredId: item.monitoredId,
        text: item.text,
        idConversation: item.idConversation,
        idRelatedMessage: item.idRelatedMessage,
        externalId: item.externalId,
        idAuthor: item.idAuthor,
        authorName: item.authorName,
        alert: item.users[0].$extras.pivot_alert,
        checked: item.users[0].$extras.pivot_checked,
        userId: item.users[0].$extras.pivot_user_id
      }
    })

    for (const followed of monitoredList) {
      followed['messages'] = [];
      for (const message of messages) {
        if (message.monitoredId == followed.id) {
          followed['messages'].push(message);
        }
      }
    }

    //console.log(monitoredList);

    return monitoredList
  }

  public static async availingMessage({message, id}){
    const tokenizer = new natural.WordTokenizer()
    const nounInflector = new natural.NounInflector()
    const tokenizedMessage = tokenizer.tokenize(message)
    const filter = await Database.query().select('filter').from('users').where('id','=',id)
    let test:any = []
    tokenizedMessage.forEach((token)=>{
      test.push(nounInflector.singularize(token))
    })
    let aux
    if(filter){
      aux = filter[0]['filter'].filtro.map((word)=>{
        if(tokenizedMessage.indexOf(word) > 0) return true
        return false
      })
    }
    if(aux.indexOf(true)>0) return true
    return false
  }

  public static async storeTweets() {
    const monitoredList = await this.getAllFollowed('twitter')
    let tweetList : Array<any> = []
    if(monitoredList) {
      for (const monitored of monitoredList) {
        let tweetListRaw = await TwitterService.getTweets(monitored.$attributes)
        let meta = tweetListRaw.meta
        if (meta.result_count > 0) {
          for (const data of tweetListRaw.data) {
            let tweet = {
              //alert: await this.availingMessage({message:data.text,id:monitored.monitor_id}),
              text: data.text,
              idConversation: data.conversation_id,
              externalId: data.id,
              idAuthor: data.author_id,
              authorName: monitored.$attributes.external_id == data.author_id ? monitored.$attributes.user_name : await TwitterService.getUsernameById(data.author_id),
              idRelatedMessage: data.referenced_tweets ? data.referenced_tweets[0].id : undefined,
              monitoredId: monitored.$attributes.id,


            }
            const postSchema = schema.create({
              text: schema.string({}, [rules.required()]),
              authorName: schema.string({}, [rules.required()]),
              idConversation: schema.number([rules.required()]),
              externalId: schema.number([rules.required()]),
              idAuthor: schema.number([rules.required()]),
              monitoredId: schema.number([rules.required()]),

            })
            const messages = {
              'text.required': 'Mensagem sem texto',
              'monitoredId.required': 'Mensagem sem monitorado associado',
              'idConversation.required': 'Mensagem sem id_conversation',
              'externalId.required': 'Mensagem sem id',
              'idAuthor.required': 'Mensagem sem id do autor',
            }
            try {
              await validator.validate({ schema: postSchema, data: tweet, messages: messages })
              tweetList.push(tweet)
            } catch (error) {

              return error

            }
          }
          const teste = await Message.updateOrCreateMany('externalId', tweetList)
          teste.forEach((item) => {
            monitored.user.map(async (u) =>
            await item.related('users').sync({
              [u.id]: {
                alert: true,
                checked: false
              }
            }, false)

            )
          })
          await Monitored.query().where('id', monitored.$attributes.id).update({ 'last_message_id': meta.newest_id })
          tweetList = []
        }
      }
    }
  }
}

export default MonitoredService
