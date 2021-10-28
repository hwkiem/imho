FROM node:16.13-bullseye-slim

EXPOSE 3000

# Install packages
WORKDIR /app/
COPY client/yarn.lock client/package.json ./
RUN yarn install

# Copy in source
COPY client/ ./

# TODO: command for running in prod