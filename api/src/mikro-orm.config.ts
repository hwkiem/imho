import { MikroORM } from '@mikro-orm/core';

export default {
    migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
        disableForeignKey: false,
        transactional: true,
        wrap: false,
    },
    wrap: false,
    clientUrl: process.env.LOCAL_DB_URL,
    port: 5432,
    debug: true,
    entities: ['./dist/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
    type: 'postgresql',
    driverOptions:
        process.env.NODE_ENV === 'production'
            ? {
                  connection: {
                      ssl: {
                          rejectUnauthorized: false,
                      },
                  },
                  wrap: false,
              }
            : undefined,
} as Parameters<typeof MikroORM.init>[0];
