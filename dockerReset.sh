#!/bin/bash

docker rm $(docker ps -aq) && docker rmi $(docker images -q) && docker network prune && docker volume prune && docker-compose up --build

