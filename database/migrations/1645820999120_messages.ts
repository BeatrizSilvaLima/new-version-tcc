import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.text('text').notNullable()
      table.bigInteger('id_conversation').notNullable()
      table.bigInteger('id_related_message').nullable()
      table.bigInteger('external_id').notNullable()
      table.bigInteger('id_author').notNullable()
      table.string('author_name').notNullable()
      table.string('url', 240).nullable()
      table.bigInteger('monitored_id').references('id').inTable('monitoreds').notNullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('read_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
