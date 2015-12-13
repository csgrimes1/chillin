const parser = require('./commandline-parser')
    , resolver = require('./waiter-resolver')
    , cmdLine = parser.parse(process.argv)
    , moduleName = resolver.resolve(cmdLine._.module)
    , waiterModule = require(moduleName)
    , moduleOptions = waiterModule.adaptCommandLine
        ? waiterModule.adaptCommandLine(cmdLine, process.argv)
        : cmdLine
    , promise = waiterModule.wait(moduleOptions)

promise.then(
    function(){
        process.exit(0)
    },
    function(e){
        console.error(e)
        process.exit(1)
    }
)