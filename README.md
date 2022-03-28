# IMHO - Repository

### Developer's Guide

1. Running `yarn` in the root of this monorepo will install all necessary dependencies for both the `/api` and `/client` packages.

***DATABASE***

This is subject to change with docker implementations of postgres and redis, but the DB needs the postgis extension installed. Running the initial migration and the seed commands from the `/api` directory will create all necessary tables. Connection details need to be provided in `/api/.env` for server to work.

Knex is used for querybuilding. See `/api/src/database/knexfile.ts` for details.

***`/api`***

The `/api` package contains the graphql backend for IMHO. These commands are listed in `/api/package.json`, but here they are with a little more info.

- `yarn watch` watches for filechanges on the `/api/src` directory and re-runs `tsc` on save.
- `yarn start` starts the backend development sever on localhost:3000/graphql. Navigating to this url will open the graphql playground.

See `/api/package.json` for database migration and seeding commands.

A `.env` file is required in the `/api` directory. An example is provided at `/api/.env.example`

***`/client`

The `/client` package contains the Next web application for IMHO. Again, these commands are in `/client/package.json`.

- `yarn dev` started the Next development server on localhost:4000.
- `yarn gen` uses graphql-codegen to create typesafe hooks using the documents in `/client/src/graphql` and the schema at localhost:3000/graphql. The backend must be running for this command to work.

A `.env.local` is required in the `/client` directory. An example is provided at `/client/.env.local.example`.


### Docker-compose setup

This setup can run in docker-compose. To get started:
```
docker-compose up --build
```
This will start up postgres, redis, api (watch and server) and client (dev).

To run commands against either project, use docker-compose exec. E.g. to migrate and seed the database:
```
docker-compose exec api yarn migrate:latest
docker-compose exec api yarn seed:run
```
Then navigate to either:
* http://localhost:3000/graphql for the api
* http://localhost:4000/ for the client

If you want to connect directly to postgres or redis, they are available on `localhost:5432` (postgres) and `localhost:6379` (redis).


**Note**: The api/ and client/ directories are mounted into the docker containers when they run under docker-compose. This can lead to some funky behaviors with regards to folders generated inside of the running containers (namely `dist`, `node_modules` and `.next`). To avoid these leaking out, they are contained in anonymous volumes, but that does mean that empty folders might show up on the host. If that's the case, they can safely be deleted.

We need to add more...
