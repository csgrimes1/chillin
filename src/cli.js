const _ = require('lodash')
    , parser = require('./commandline-parser')

function commandLineInfo(){
    const package = require('../package.json'),
        cmd = _.keys(package.bin)[0]
    console.log(`COMMAND LINE:\n> ${cmd} module module-options`)
}

function preValidate(argv){
    const argv2 = parser.sliceRelevantArguments(argv)
    if( argv2.length < 2 ){
        throw new Error('Module name and parameters required.')
    }
    return argv2
}

try {
    const resolver = require('./waiter-resolver')
        , argv = preValidate(process.argv)
        , cmdLine = parser.parse(argv)
        , moduleName = resolver.resolve(cmdLine._.module)
        , waiterModule = require(moduleName)
        , moduleOptions = waiterModule.adaptCommandLine
        ? waiterModule.adaptCommandLine(cmdLine, process.argv)
        : cmdLine
        , promise = waiterModule.wait(moduleOptions)

    promise.then(
        function () {
            process.exit(0)
        },
        function (e) {
            console.error(e)
            commandLineInfo()
            process.exit(1)
        }
    )
}
catch(x){
    console.error(x)
    commandLineInfo()
}