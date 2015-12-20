###Introduction

This tool is intended to be used either in bash or a node.js project. It waits for a resource
(such as a database) to become available, then it starts another process. Let's illustrate with
an example. Say you have a Docker Compose environment that starts containers _S_ and _D_ (for _database_).
_S_ depends on _D_, but _D_ can be slow to start up. _S_ can use _chillin_ in either of two ways.

1. The NodeJS startup script can be modified to use the _chillin_ NPM package.
2. A startup bash script can utilize the _chillin_ CLI.

###NodeJS Example

```javascript
const whenWarm = require('chillin')
    , promise = whenWarm.loadWaiterModule('port')
        .configure('host', 'www.google.com')
        .configure('port', 80)
        .start()

promise.then(function(){
    console.log('OK!')
}, function(x){
    console.error(`Failed: ${x}`)
})

```

###CLI Example
```bash
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


```
