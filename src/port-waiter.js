const net = require('net'),
    _ = require('lodash'),
    cp = require('./commandline-parser')

module.exports = {
    wait(opt){
        return new Promise((resolve, reject) => {
            var client = net.connect(_.pick(opt, 'host', 'port'), function () {
                client.end();
                resolve()
            })
            client.setTimeout(opt.timeout, ()=>{
                client.end()
                reject(new Error('SOCKET_TIMEOUT'))
            })
            client.on('error', function (e) {
                client.end()
                if( e.code === 'ECONNREFUSED'){
                    const now = new Date().getTime()
                        , newOpt = _.assign({}, opt, {startTime: opt.startTime || now})
                    if( newOpt.startTime - (opt.startTime || now) < opt.timeout ){
                        setTimeout(()=>{
                            module.exports.wait(newOpt)
                        }, opt.retryInterval || 1000)
                        return;
                    }
                }
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