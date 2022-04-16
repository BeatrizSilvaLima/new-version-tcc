import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersMessages extends BaseSchema {
  protected tableName = 'users_messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger('user_id').references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.bigInteger('message_id').references('id').inTable('messages').notNullable().onDelete('CASCADE')
      table.boolean('alert').notNullable().defaultTo(false)
      table.boolean('checked').notNullable().defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
