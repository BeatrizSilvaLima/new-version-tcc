import { BaseModel, beforeSave, column, HasManyThrough, hasManyThrough, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import Monitored from 'App/Models/Monitored'
import Message from './Message'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime()
  public birthday: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ columnName: 'user_name' })
  public userName: string

  @column()
  public name: string

  @column()
  public surname: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ columnName: 'remember_me_token' })
  public rememberMeToken: string

  @manyToMany(() => Monitored, {
    pivotTable: 'users_monitoreds',
    pivotColumns: ['active', 'filter'],
    pivotTimestamps: true
  })
  public tasks: ManyToMany<typeof Monitored>

  @manyToMany(() => Message, {
    pivotTable: 'users_messages',
    pivotColumns: ['alert', 'checked'],
    pivotTimestamps: true
  })
  public messages: ManyToMany<typeof Message>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
