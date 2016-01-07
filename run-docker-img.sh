#!/bin/sh

source docker-env.sh

eval "$(docker-machine env $MACHINE_NAME)"

$DOCKER RUN $IMGNAME -p $PORT

exit 0
