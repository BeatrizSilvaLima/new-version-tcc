import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

class MonitoredValidator {
  constructor(private ctx: HttpContextContract) {}
  public schema = schema.create({
    userName: schema.string({}, [
      rules.maxLength(50),
      //rules.unique({ table: 'monitoreds', column: 'user_name', where:{active:this.refs.active, monitorId:this.refs.monitorId}}),
      rules.required(),
    ]),
    socialMedia: schema.string({}, [rules.required()]),
    monitorId: schema.number([rules.required()]),
  })
  public cacheKey = this.ctx.routeKey
  public messages = {
    'userName.required': 'Digite o username de quem você deseja monitorar',
    'userName.unique': 'Teste',
    'userName.maxLegth': 'Username só pode ter até 50 caracteres',
    'socialMedia.required': 'Informe a rede social do usuário a ser monitorado',
    'monitorId.required': 'Você precisa estar logado para monitorar uma pessoa',
  }
}



export default MonitoredValidator
