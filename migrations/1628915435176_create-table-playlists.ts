import { MigrationBuilder } from 'node-pg-migrate'

export async function up (pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })

  pgm.addConstraint('playlists', 'fk_playlists.owner_user.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

export async function down (pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('playlists')
}
