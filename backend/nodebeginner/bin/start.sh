#!/bin/sh

set -x

CURRENT_DIR=`pwd`

if [ ! -f "pid" ]; then
  node ../app.js ../conf/config.json &
  echo $! > pid
fi
