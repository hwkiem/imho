import Knex from 'knex';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT!),
    },
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
