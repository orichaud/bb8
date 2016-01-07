#!/bin/sh

source docker-env.sh

eval "$(docker-machine env $MACHINE_NAME)"

$DOCKER build -t $IMGNAME:$IMGVERSION

$DOCKER images

exit 0
