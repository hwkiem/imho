#!/bin/sh
pwd
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
pwd
# echo $parent_path

for i in $(cat ../../../.env); do
export $i;
done;
sleep 5;
yarn $1
