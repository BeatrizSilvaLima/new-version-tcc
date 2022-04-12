import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Message from 'App/Models/Message'

export default class Monitored extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'monitored_id' })
  public monitoredId: number

  @column({ columnName: 'last_message_id' })
  public lastMessageId: number

  @column({ columnName: 'monitor_id' })
  public monitorId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @column()
  public active: boolean

  @column({ columnName: 'user_name' })
  public userName: string

  @column({ columnName: 'social_media' })
  public socialMedia: string

  @belongsTo(() => User, {
    localKey: 'monitorId',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'monitoredId'
  })
  public messages: HasMany<typeof Message>
}
