const shell = require('child_process')
    , cp = require('./commandline-parser')
    , _ = require('lodash')

module.exports = {
    wait(opts){
        return new Promise((resolve, reject) => {
            shell.exec(opts.commandLine, {timeout: opts.timeout}, (error, stdout, stderr)=> {
                if (error) {
                    reject(error)
                }
                else {
                    resolve()
                }
            })
        })
    },

    adaptCommandLine(parsedCmdLine, rawCommandLine){
        const relevantArgs = cp.sliceRelevantArguments(rawCommandLine),
            indexOfName = relevantArgs.indexOf('exec'),
            prefixArgs = _.omit(cp.parse(relevantArgs.slice(0, indexOfName)), '_'),
            afterName = relevantArgs.slice(indexOfName + 1)
        return _.assign({}, prefixArgs, {
            commandLine: afterName.join(' ')
        })
    }
}
