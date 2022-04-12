import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Monitoreds extends BaseSchema {
  protected tableName = 'monitoreds'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.boolean('active').notNullable().defaultTo(true)
      table.string('social_media').notNullable()
      table.bigInteger('monitored_id').notNullable()
      table.bigInteger('last_message_id').nullable()
      table.string('user_name').notNullable()
      table.bigInteger('monitor_id').references('id').inTable('users').notNullable()
      table.json('filter')
      table.timestamp('deleted_at', { useTz: true }).nullable()
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
