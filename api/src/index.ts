import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { Container } from 'typedi';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { ReviewResolver } from './resolvers/review.resolver';

// var morgan = require('morgan')

const main = async () => {
    const app = express();

    const orm = await MikroORM.init({
        entities: ['./dist/app/**/entities'],
        dbName: 'imho',
        type: 'postgresql',
        clientUrl: process.env.DATABASE_URL,
    });

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
            resolvers: [ReviewResolver],
            container: Container,
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            orm,
        }),
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
