import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import {
    Connection,
    IDatabaseDriver,
    MikroORM,
    RequestContext,
} from '@mikro-orm/core';
import { ReviewResolver } from './resolvers/review.resolver';
import { PlaceResolver } from './resolvers/place.resolver';
import { MyContext } from './utils/context';
import ormConfig from './mikro-orm.config';
import { UserResolver } from './resolvers/user.resolver';
import Container from 'typedi';
import registerTypegraphqlEnums from './services/registerTypegraphqlEnums';

const main = async () => {
    const app = express();

    registerTypegraphqlEnums();

    const orm: MikroORM<IDatabaseDriver<Connection>> = await (async () => {
        try {
            const orm = await MikroORM.init({
                ...ormConfig,
                clientUrl: process.env.DATABASE_URL, // overwrite cli setting
            });
            console.log('Connection secured.');
            const migrator = orm.getMigrator();
            const migrations = await migrator.getPendingMigrations();
            if (migrations && migrations.length > 0) {
                await migrator.up();
                console.log('migrations applied.');
            }
            return orm;
        } catch (error) {
            console.error('📌 Could not connect to the database', error);
            throw Error(error);
        }
    })();

    // Redis Cookies / Sessions
    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.set('trust proxy', 1);

    const whitelist: (string | RegExp)[] = process.env.CORS_ORIGIN_WHITELIST
        ? process.env.CORS_ORIGIN_WHITELIST.split(' ')
        : ([] as string[]);

    // regex used for dynamic branch cors origins
    const regex = process.env.CORS_ORIGIN_REGEX
        ? new RegExp(process.env.CORS_ORIGIN_REGEX)
        : null;
    if (regex) whitelist.push(regex);

    app.use(
        cors({
            origin: whitelist,
            credentials: true,
        })
    );
    app.use(
        session({
            name: 'oreo',
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'dev' ? false : true,
                sameSite: process.env.NODE_ENV === 'dev' ? 'lax' : 'none',
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET
                ? process.env.SESSION_SECRET
                : '',
            resave: false,
        })
    );

    app.use((_, __, next) => {
        RequestContext.create(orm.em, next);
    });

    // Configure ApolloServer
    const apolloServer = new ApolloServer({
        plugins:
            process.env.NODE_ENV === 'dev'
                ? [ApolloServerPluginLandingPageGraphQLPlayground]
                : [],
        schema: await buildSchema({
            resolvers: [ReviewResolver, PlaceResolver, UserResolver],
            validate: true,
            container: Container,
        }),
        context: ({ req, res }) =>
            ({ req, res, em: orm.em.fork(), redis } as MyContext),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.listen(process.env.PORT, () => {
        console.log(
            `server started on http://localhost:${process.env.PORT}/graphql`
        );
    });
};

main().catch((err) => {
    console.error(err);
});
