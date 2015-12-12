#!/usr/bin/env bash

#Location where supporting scripts live.
export PRIVATE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Convenient to have this variable.
export PROJECTROOT=$(cd $PRIVATE/../.. && pwd)
export NPMBIN=$(npm bin)
