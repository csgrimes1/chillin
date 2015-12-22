## Introduction

This tool is intended to be used either in bash or a node.js project. It waits for a resource
(such as a database) to become available, then it starts another process. It just chills until
the timeout expires or the wait condition is satisfied.

Let's illustrate with
an example. Say you have a Docker Compose environment that starts containers _S_ and _D_ (for _database_).
_S_ depends on _D_, but _D_ can be slow to start up. _S_ can use _chillin_ in either of two ways.

1. The NodeJS startup script can be modified to use the _chillin_ NPM package.
2. A startup bash script can utilize the _chillin_ CLI.

_Please Note_ Chillin uses EcmaScript 6. It will not run on older versions of NodeJS!

## NodeJS Example

```javascript
#include examples/example-port.js
```

## To Run Chillin Inside Your Project
```
> npm install chillin --save-dev
> export PATH=$PATH:$(npm bin)
> chillin port www.google.com 80
```

## BASH Example

Please reference the example above if you are installing Chillin in your project rather than as a global
package. The line that changes the PATH variable can be added to the example below to make it run with
a locally installed package.

```bash
#include examples/wait-for-postgres.sh
```

## Types of Waits
There are three built-in waiter modules: _port_, _exec_, and _mock_. The _port_ waiter is shown in the examples. The
_exec_ module waits for a process to start and complete or time out. The _mock_ module is for testing purposes. Other
modules may be loaded using a path consistent with _require()_ in NodeJS.

## The _port_ Waiter
`chillin www.github.com 80 --timeout 2000`

The positional arguments are `ADDRESS PORT`

## The _exec_ Waiter
`chillin --timeout 2000 echo "Hello"`

The positional arguments correspond to `COMMAND arg1 arg2 ... argN`
