FROM node:16.13-bullseye-slim

EXPOSE 3000

# Install packages
WORKDIR /app/
COPY api/yarn.lock api/package.json ./
RUN yarn install

# Copy in source
COPY api/ ./

# TODO: command for running in prod