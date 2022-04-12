import Monitored from 'App/Models/Monitored'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import TwitterService from 'App/Services/TwitterService'
import Database from '@ioc:Adonis/Lucid/Database'
import Message from "App/Models/Message";
import natural from "natural";

class MonitoredService {
  public static async postFollow({ request, session }) {
    request.all().monitoredId = await TwitterService.getUser(request.all().userName)
    const postSchema = schema.create({
      monitoredId: schema.number([
        rules.unique({
          table: 'monitoreds',
          column: 'monitored_id',
          where: { active: true, monitor_id: request.all().monitorId },
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
    delete request.all()._csrf
    await Monitored.updateOrCreate(
      {
        monitoredId: request.all().monitoredId,
        monitorId: request.all().monitorId,
        socialMedia: request.all().socialMedia,
      },
      request.all()
    )
  }
  public static async updateFilter({request, auth}) {
    const teste = await Database.query()
      .update('filter',request.all().filter)
      .from('users')
      .where('id','=',auth.user.id)

    return teste
  }
  public static async getFollow({ auth }) {
    const monitored = await Database.query()
      .select('*')
      .from('monitoreds')
      .where('monitor_id', '=', auth.user.id)
      .andWhere('active', '=', true)
    return monitored
  }
  public static async getAllFollowed() {
    const monitored = await Database.query()
      .select(['monitored_id','last_message_id','monitor_id','social_media','id','user_name'])
      .from('monitoreds')
      .where('active', '=', true)
    return monitored
  }

  public static async stopFollow({ request, auth }) {
    const monitored = await Database.query()
      .update({active:false, last_message_id:null}, ['monitored_id', 'active'])
      .from('monitoreds')
      .where('monitor_id', '=', auth.user.id)
      .andWhere('monitored_id', '=', request.all().monitoredId)
    return monitored
  }

  public static async refreshTweets({auth}) {
    const monitoredList = await this.getFollow({auth})
    console.log(monitoredList)
    const monitoredId = monitoredList.map(function(monitored){
      return monitored.id
    })
    const messages = await Database.query().select('*').from('messages').where('monitored_id','IN',monitoredId).orderBy('monitored_id', 'asc').orderBy('id_conversation', 'asc').orderBy('id_message', 'asc')

    for (const followed of monitoredList) {
      followed.messages = [];
      for (const message of messages) {
        if (message.monitored_id == followed.id) {
          followed.messages.push(message);
        }
      }
    }

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
    const monitoredList = await this.getAllFollowed()
    let tweetList : Array<any> = []
    if(monitoredList) {
      for (const monitored of monitoredList) {
        let tweetListRaw = await TwitterService.getTweets(monitored)
        let meta = tweetListRaw.meta
        if (meta.result_count > 0) {
          for (const data of tweetListRaw.data) {
            let tweet = {
              //alert: await this.availingMessage({message:data.text,id:monitored.monitor_id}),
              alert: false,
              message: data.text,
              idConversation: data.conversation_id,
              idMessage: data.id,
              idAuthor: data.author_id,
              authorName: monitored.monitored_id == data.author_id ? monitored.user_name : await TwitterService.getUsernameById(data.author_id),
              idRelatedMessage: data.referenced_tweets ? data.referenced_tweets[0].id : undefined,
              monitoredId: monitored.id,


            }
            const postSchema = schema.create({
              message: schema.string({}, [rules.required()]),
              authorName: schema.string({}, [rules.required()]),
              idConversation: schema.number([rules.required()]),
              idMessage: schema.number([rules.required()]),
              idAuthor: schema.number([rules.required()]),
              monitoredId: schema.number([rules.required()]),

            })
            const messages = {
              'message.required': 'Mensagem sem texto',
              'monitoredId.required': 'Mensagem sem monitorado associado',
              'idConversation.required': 'Mensagem sem id_conversation',
              'idMessage.required': 'Mensagem sem id',
              'idAuthor.required': 'Mensagem sem id do autor',
            }
            try {
              await validator.validate({ schema: postSchema, data: tweet, messages: messages })
              tweetList.push(tweet)
            } catch (error) {

              return error

            }
          }
          await Message.updateOrCreateMany('idMessage', tweetList)
          await Monitored.query().where('id', monitored.id).update({ 'last_message_id': meta.newest_id })
          tweetList = []
        }
      }
    }
  }
}

export default MonitoredService
