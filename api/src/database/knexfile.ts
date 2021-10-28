import { Knex } from 'knex';
import path from 'path';

const knexConfig: Knex.Config = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: path.join(__dirname, './migrations'),
    },
};

export default knexConfig;
