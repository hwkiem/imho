import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { UserResolver } from './User/user_resolver';
import { ResidencyResolver } from './Residence/residence_resolver';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { postgresHandler } from './DataSources/postgres';
import { ReviewResolver } from './Review/review_resolver';
import { googleMapsHandler } from './DataSources/mapsAPI';
import { LocationResolver } from './Location/location_resolver';

var morgan = require('morgan')

const main = async () => {
    const app = express();

    // Redis Cookies / Sessions
    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.set('trust proxy', 1);
    app.use(morgan("combined"))
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
            secret: process.env.SESSION_SECRET!,
            resave: false,
        })
    );

    // Configure AppolloServer
    const apolloServer = new ApolloServer({
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        schema: await buildSchema({
            resolvers: [
                UserResolver,
                ResidencyResolver,
                ReviewResolver,
                LocationResolver,
            ],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
        }),
        dataSources: () => {
            return {
                pgHandler: new postgresHandler(),
                googleMapsHandler: new googleMapsHandler(),
            };
        },
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.listen(process.env.PORT, () => {
        console.log(`server started on http://localhost:${process.env.PORT}`);
    });
}; //

main().catch((err) => {
    console.error(err);
});
