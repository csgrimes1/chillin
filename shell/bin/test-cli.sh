#!/usr/bin/env bash
MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function run {
    $MYDIR/cli.sh - ${@:2}
    RC=$?
    if [ $RC == 0 ]; then
        echo "# ${@:2}"
        echo "ok $1 returned zero"
    else
        echo "# ${@:2}" >&2
        echo "not ok $1 returned $RC" >&2
    fi
}

run 1 port www.yahoo.com 80 --timeout 500000
run 2 exec echo hello --timeout 5
