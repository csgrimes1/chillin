#!/usr/bin/env bash

MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJDIR="$( cd $MYDIR/../.. && pwd )"
PUBDIR=$PROJDIR/.publish

mkdir -p $PUBDIR
set -x
cp $PROJDIR/package.json $PUBDIR/
cp $PROJDIR/readme.md $PUBDIR/
cp -r $PROJDIR/src $PUBDIR/
cp -r $PROJDIR/shell $PUBDIR/

npm publish $PUBDIR
