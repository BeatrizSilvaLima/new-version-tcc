import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

class SignUpValidator {
  constructor(private ctx: HttpContextContract) {}
  public schema = schema.create({
    userName: schema.string({}, [
      rules.maxLength(50),
      rules.unique({ table: 'users', column: 'user_name' }),
      rules.required(),
    ]),
    password: schema.string({}, [rules.maxLength(10), rules.required(), rules.confirmed()]),
    email: schema.string({}, [
      rules.unique({ table: 'users', column: 'email' }),
      rules.email(),
      rules.required(),
    ]),
  })
  public cacheKey = this.ctx.routeKey
  public messages = {
    'userName.required': 'Nome de usuário não informado',
    'userName.maxLegth': 'Nome de usuário só pode ter até 50 caracteres',
    'userName.unique': 'Nome de usuário já existe',
    'password.required': 'Senha não informada',
    'password.maxLength': 'Senha só pode ter até 10 caracteres',
    'password.confirmed': 'As senhas não estão iguais',
    'email.unique': 'E-mail já está sendo utilizado',
    'email.required': 'E-mail não informado',
    'email.email': 'Formato do e-mail é inválido',
  }
}

export default SignUpValidator
