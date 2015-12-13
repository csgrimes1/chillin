
const net = require('net'),
    _ = require('lodash'),
    cp = require('./commandline-parser')

module.exports = {
    wait(opt){
        return new Promise((resolve, reject) => {
            var client = net.connect(_.pick('host', 'port'), function () {
                client.end();
                resolve()
            })
            client.on('error', function (e) {
                client.end()
                reject(e)
            })
        })
    },

    adaptCommandLine(parsedCmdLine, rawCommandLine){
        const options = cp.readPositionalArgs(parsedCmdLine._.args, {host: cp.REQUIREDARG, port: cp.REQUIREDARG})
        return _.chain(parsedCmdLine)
            .omit('_')
            .assign({}, options)
            .value()
    }
}