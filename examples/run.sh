#!/usr/bin/env bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$THISDIR/../shell/bin/build.sh

source $THISDIR/../shell/bin/setup-dev-env.sh
ls -1 $THISDIR/*.js | xargs node

source $THISDIR/wait-for-postgres.sh not-a-valid-server --timeout 1000
