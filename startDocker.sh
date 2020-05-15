#!/usr/bin/env bash

DIR="$( cd "$( dirname $0 )" && pwd )"
cd $DIR

docker-compose stop
docker-compose rm -f
docker-compose build

UNUSEIMAGES=$(docker images --filter "dangling=true" -q --no-trunc)
if [ "$UNUSEIMAGES" != "" ]; then
    docker rmi $UNUSEIMAGES
fi
docker-compose up -d
