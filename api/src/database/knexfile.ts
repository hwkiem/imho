import Knex from 'knex';
import path from 'path';
import dotenv from 'dotenv';
// const { error, parsed } = dotenv.config();
// console.log(error, parsed);

if (require.main === module) {
    dotenv.config({ path: '../../.env' });
}
const knexConfig: Knex.Config = {
    // client: 'pg',
    // connection: {
    //     user: 'renter',
    //     host: 'localhost',
    //     database: 'api',
    //     password: 'renter',
    //     port: 5432,
    // },
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
        directory: path.join(__dirname, './migrations'),
    },
};

export default knexConfig;
