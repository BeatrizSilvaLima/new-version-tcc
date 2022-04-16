import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersMonitoreds extends BaseSchema {
  protected tableName = 'users_monitoreds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.bigInteger('monitored_id').unsigned().references('id').inTable('monitoreds').notNullable().onDelete('CASCADE')
      table.unique(['user_id', 'monitored_id'])
      table.boolean('active').notNullable().defaultTo(true)
      table.json('filter')
      table.timestamp('deleted_at', { useTz: true }).nullable()

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
