import {MigrationBuilder} from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true
        },
        performer: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        genre: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        duration: {
            type: 'INTEGER',
            notNull: true
        },
        inserted_at: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        updated_at: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    })

}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('songs')
}
