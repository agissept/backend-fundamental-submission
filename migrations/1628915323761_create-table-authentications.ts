import { MigrationBuilder } from 'node-pg-migrate'

export async function up (pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true
    }
  })
}

export async function down (pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('authentications')
}
