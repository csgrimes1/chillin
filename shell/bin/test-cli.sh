#!/usr/bin/env bash
MYDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function run {
    $MYDIR/cli.sh - ${@:2}
    RC=$?
    if [ $RC == 0 ]; then
        echo "# ${@:2}"
        echo "ok $1 succeeded"
    else
        echo "# ${@:2}" >&2
        echo "not ok $1 returned $RC" >&2
    fi
}

# You can test this next line further by doing the following:
# 1. sudo vi /etc/hosts
# 2. Add an entry 127.0.0.1 www.yahoo.com
# 3. Start this script. With the long timeout, it should continue to retry your
#    laptop on port 80. You should not have a web server running on port 80 or
#    this test will return immediately.
# 4. Change /etc/hosts again, either removing the new line or renaming the
#    entry to www.yahoo.com.fake.
run 1 port www.yahoo.com 80 --timeout 500000
run 2 exec echo hello --timeout 5
