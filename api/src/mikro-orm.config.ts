import { MikroORM } from '@mikro-orm/core';

export default {
    migrations: {
        path:
            process.env.NODE_DEV === 'true'
                ? './src/migrations'
                : './dist/migrations',
        tableName: 'migrations',
        transactional: true,
    },
    tsNode: process.env.NODE_DEV === 'true' ? true : false,
    clientUrl: process.env.DATABASE_URL,
    entities: ['./dist/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    type: 'postgresql',
    driverOptions: {
        connection: { ssl: true },
    },
} as Parameters<typeof MikroORM.init>[0];
