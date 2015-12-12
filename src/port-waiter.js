
const net = require('net'),
    _ = require('lodash')

module.exports = function(opt){
    return new Promise((resolve, reject) => {
        var client = net.connect(_.pick('host', 'port'), function() {
            client.end();
            resolve()
        })
        client.on('error', function(e){
            client.end()
            reject(e)
        })
    })
}