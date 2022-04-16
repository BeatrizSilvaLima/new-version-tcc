import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Monitored from 'App/Models/Monitored'
import User from './User'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public createdAt: DateTime

  @column()
  public text: string

  @column({ columnName: 'id_conversation' })
  public idConversation: number

  @column({ columnName: 'id_related_message' })
  public idRelatedMessage: number

  @column({ columnName: 'external_id' })
  public externalId: number

  @column({ columnName: 'id_author' })
  public idAuthor: number

  @column({ columnName: 'author_name' })
  public authorName: string

  @column()
  public url: string

  @column({ columnName: 'monitored_id' })
  public monitoredId: number

  @belongsTo(() => Monitored, {
    localKey: 'id'
  })
  public monitoreds: BelongsTo<typeof Monitored>

  @manyToMany(() => User, {
    pivotTable: 'users_messages',
    pivotColumns: ['alert', 'checked'],
    pivotTimestamps: true
  })
  public users: ManyToMany<typeof User>
}
