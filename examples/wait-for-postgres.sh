#!/usr/bin/env bash

if [ $# -lt 1 ]; then
    echo "Name/IP of Postgres server required." 1>&2;
    echo "> $0 PGSERVER" 1>&2;
    exit 1
fi

#If you want to suppress error output on failure, you can redirect
#stderr to null on the next line.
chillin port $1 5432
#Get the exit code
RESULT=$?

if [ $RESULT == 0 ]; then
    echo "Starting the program that depends on Postgres..."
else
    echo "Failed! Not starting the program." 1>&2
    exit $RESULT
fi

