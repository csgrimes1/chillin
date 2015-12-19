#!/usr/bin/env bash
MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $MYDIR/init-env.sh
$PRIVATE/node6.sh $NPMBIN/tap --reporter=list --coverage $PROJECTROOT/test/*.test.js
