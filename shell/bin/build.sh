#!/usr/bin/env bash
MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECTROOT=$MYDIR/../..
DOCDIR=$PROJECTROOT/doc

node $DOCDIR/rip-readme - $DOCDIR/readme.template.md > $PROJECTROOT/readme.md
