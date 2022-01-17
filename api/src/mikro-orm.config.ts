import { MikroORM } from '@mikro-orm/core';

export default {
    migrations: {
        path: './src/migrations',
        tableName: 'migrations',
        transactional: true,
    },
    tsNode: process.env.NODE_DEV === 'true' ? true : false,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: 5432,
    debug: true,
    entities: ['./dist/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0];
