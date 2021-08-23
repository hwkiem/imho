import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import Pool from "pg-pool";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";
import { Client } from "@googlemaps/google-maps-services-js";
import { initDB } from "./utils/initializeDB";
import { UserResolver } from "./User/user_resolver";
import { ResidencyResolver } from "./Residence/residence_resolver";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { postgresHandler } from "./dataSources/postgres";
import { ReviewResolver } from "./Review/review_resolver";
import cors from "cors";

const main = async () => {
  const app = express();

  // Google Maps client
  // const client = new Client({ config: { auth: {username: '', password: process.env.GOOGLE_API_KEY!} } });
  const client = new Client({});

  // Create Pool of postgres clients
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!),
  });

  // Initialize Database Tables, Relationships, Triggers
  await initDB(pool);

  // Serve static files
  // app.use('/', express.static('./dist/public/'));

  // Redis Cookies / Sessions
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: "oreo",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: false, // cookie only works in https
        // domain: __prod__ ? '.codeponder.com' : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );

  // const db: Database = new Database(knexConfig);

  // Configure AppolloServer
  const apolloServer = new ApolloServer({
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    schema: await buildSchema({
      resolvers: [UserResolver, ResidencyResolver, ReviewResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      client,
    }),
    dataSources: () => {
      return {
        pgHandler: new postgresHandler(),
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
