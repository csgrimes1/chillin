#!/usr/bin/env bash
MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $MYDIR/init-env.sh
$PRIVATE/node6.sh $PROJECTROOT/src/cli - $@
