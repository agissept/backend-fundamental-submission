import { MigrationBuilder } from 'node-pg-migrate'
export async function up (pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    username: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true
    },
    password: {
      type: 'TEXT',
      notNull: true
    },
    fullname: {
      type: 'TEXT',
      notNull: true
    }
  })
}

export async function down (pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users')
}
