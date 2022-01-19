import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { buildSchema, registerEnumType } from 'type-graphql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
// import { Container } from 'typedi';
import {
    Connection,
    IDatabaseDriver,
    MikroORM,
    RequestContext,
} from '@mikro-orm/core';
import { ReviewResolver } from './resolvers/review.resolver';
import { PlaceType } from './utils/enums/PlaceType.enum';
import {
    ConFlagType,
    DbkFlagType,
    ProFlagType,
} from './utils/enums/FlagType.enum';
import { PlaceResolver } from './resolvers/place.resolver';
import { MyContext } from './utils/context';

const main = async () => {
    const app = express();

    // TODO: create service for this
    registerEnumType(PlaceType, {
        name: 'PlaceType',
        description: 'Type of the this address',
    });

    registerEnumType(ProFlagType, {
        name: 'ProFlagTypes',
        description: 'All the negative flag topics',
    });

    registerEnumType(DbkFlagType, {
        name: 'DbkFlagTypes',
        description: 'All the dealbreakers',
    });

    registerEnumType(ConFlagType, {
        name: 'ConFlagTypes',
        description: 'All the positive flag topics',
    });

    let orm: MikroORM<IDatabaseDriver<Connection>>;
    try {
        orm = await MikroORM.init({
            tsNode: process.env.NODE_DEV === 'true' ? true : false,
            clientUrl: process.env.DATABASE_URL,
            entities: ['./dist/entities/*.js'],
            type: 'postgresql',
            driverOptions: {
                connection: { ssl: { rejectUnauthorized: false } },
            },
        });
        console.log('Connection secured.');
    } catch (error) {
        console.error('📌 Could not connect to the database', error);
        throw Error(error);
    }

    // Redis Cookies / Sessions
    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.set('trust proxy', 1);
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
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
                sameSite: 'lax',
                secure: false,
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

    // Configure AppolloServer
    const apolloServer = new ApolloServer({
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        schema: await buildSchema({
            resolvers: [ReviewResolver, PlaceResolver],
            validate: true,
        }),
        context: ({ req, res }) =>
            ({ req, res, em: orm.em.fork() } as MyContext),
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
}; //

main().catch((err) => {
    console.error(err);
});
