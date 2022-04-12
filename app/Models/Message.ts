import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Monitored from 'App/Models/Monitored'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public readAt: DateTime

  @column()
  public alert: boolean

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public createdAt: DateTime

  @column()
  public message: string

  @column({ columnName: 'id_conversation' })
  public idConversation: number

  @column({ columnName: 'id_related_message' })
  public idRelatedMessage: number

  @column({ columnName: 'id_message' })
  public idMessage: number

  @column({ columnName: 'id_author' })
  public idAuthor: number

  @column({ columnName: 'author_name' })
  public authorName: string

  @column()
  public url: string

  @column({ columnName: 'monitored_id' })
  public monitoredId: number

  @belongsTo(() => Monitored, {
    localKey: 'monitoredId'
  })
  public monitoreds: BelongsTo<typeof Monitored>
}
