import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Message from 'App/Models/Message'

export default class Monitored extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'external_id' })
  public externalId: number

  @column({ columnName: 'last_message_id' })
  public lastMessageId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @column({ columnName: 'user_name' })
  public userName: string

  @column({ columnName: 'social_media' })
  public socialMedia: string

  @manyToMany(() => User, {
    pivotTable: 'users_monitoreds',
    pivotColumns: ['active', 'filter'],
    pivotTimestamps: true
  })
  public user: ManyToMany<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'monitoredId'
  })
  public messages: HasMany<typeof Message>
}
