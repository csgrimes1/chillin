#!/usr/bin/env bash

MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SEARCHDIR="$( cd "$MYDIR/../../.." && pwd )"
PROJECTROOT="$( cd "$MYDIR/../.." && pwd )"

export NODE_PATH=$SEARCHDIR:$NODE_PATH
echo $NODE_PATH

MODULENAME=$(cat $PROJECTROOT/package.json | grep '"name"' | sed 's/.*\://' | sed 's/"//g' | sed 's/\,//g')
#trim it
MODULENAME=$(echo $MODULENAME)
export MODULENAME

shopt -s expand_aliases
alias "$MODULENAME=$PROJECTROOT/shell/bin/cli.sh"
