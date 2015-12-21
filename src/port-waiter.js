const net = require('net'),
    _ = require('lodash'),
    cp = require('./commandline-parser')

function connectOnce(opt, resolve, reject) {
    var client = net.connect(_.pick(opt, 'host', 'port', 'timeout'), function () {
        client.end();
        resolve()
    })
    client.setTimeout(opt.timeout, ()=> {
        client.end()
        reject(new Error('SOCKET_TIMEOUT'))
    })
    client.on('error', function (e) {
        client.end()
        if (e.code === 'ECONNREFUSED') {
            const now = new Date().getTime()
                , newOpt = _.assign({}, opt, {startTime: opt.startTime || now})
            if (newOpt.startTime - (opt.startTime || now) < opt.timeout) {
                setTimeout(()=> {
                    connectOnce(newOpt, resolve, reject)
                }, opt.retryInterval || 1000)
                return;
            }
        }
        reject(e)
    })
}

module.exports = {
    wait(opt){
        return new Promise((resolve, reject) => {
            connectOnce(opt, resolve, reject)
        })
    },

    adaptCommandLine(parsedCmdLine, rawCommandLine){
        const options = cp.readPositionalArgs(parsedCmdLine._.args, {
            host: cp.REQUIREDARG,
            port: cp.REQUIREDARG,
            timeout: parsedCmdLine.timeout || module.exports.defaultOptions().timeout
        })
        return _.chain(parsedCmdLine)
            .omit('_')
            .assign({}, options, {port: Number(options.port)})
            .value()
    },

    defaultOptions(){
        return {
            host: null,
            port: null,
            timeout: 5000
        }
    }
}