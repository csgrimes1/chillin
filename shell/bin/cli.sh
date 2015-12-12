#!/usr/bin/env bash

SCRIPTFILE="${BASH_SOURCE[0]}"
MYDIR="$( cd "$( dirname "$SCRIPTFILE")" && pwd )"

LINKFILE=$(readlink $SCRIPTFILE)
if [ "$LINKFILE" != "" ]; then
    LINKPATH=$(dirname "$LINKFILE")
    if [ "${LINKPATH:0:1}" = "/" ]; then
        #We point to an absolute file.
        MYDIR=LINKPATH
    else
        #Mix the paths and make them absolute
        MYDIR=$(cd "$MYDIR/$LINKPATH" && pwd)
    fi
fi

$MYDIR/../private/.cli.sh $@
