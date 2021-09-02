#!/bin/sh

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

for i in $(cat ../../../.env); do
export $i;
done;
sleep 5;
echo ... rollback
yarn run migrate:rollback
echo ... migrate
yarn run migrate:latest
echo ... seeding
yarn run seed:run