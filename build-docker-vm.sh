#!/bin/sh

source docker-env.sh

if [ $($DOCKER_MACHINE ls -q | awk '{ print $1}') == $MACHINE_NAME ]; then
    echo "VM $MACHINE_NAME already exists. Deleting current one."
    $DOCKER_MACHINE rm --force $MACHINE_NAME
fi

$DOCKER_MACHINE create \
    --driver $DRIVER \
    --engine-label type=dev \
    --virtualbox-boot2docker-url https://github.com/tianon/boot2docker-legacy/releases/download/v1.9.0-rc4/boot2docker.iso \
    $MACHINE_NAME
$DOCKER_MACHINE ls $MACHINE_NAME

exit 0
