#!/bin/sh

set -x

CURRENT_DIR=`pwd`

if [ ! -f "pid" ]; then
  node $CURRENT_DIR/app.js conf/config.json &
  echo $! > pid
fi
