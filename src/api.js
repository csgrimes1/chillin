
const _ = require('lodash'),
    _options = {
        timeout: 10000,
        wait: null
    }
    , resolver = require('./waiter-resolver')

function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        const id = setTimeout(function () {
            reject(new Error('TIMEOUT')); // (A)
        }, ms);
        promise.then(function(){
            clearTimeout(id)
            resolve()
        }, function(reason){
            clearTimeout(id)
            reject(reason)
        });
    });
}

function start(options){
    const promise = this.wait(_.assign({}, this))
    return timeout(this.timeout, promise)
}

function asObject(state){
    return _.isPlainObject(state) ? state : {}
}

function merge(newSettings){
    _.chain(newSettings)
        .omit('start', 'configure')
        .keys()
        .value()
        .map( setting => {
            if (!_options.hasOwnProperty(setting)  &&  !this.hasOwnProperty(setting)) {
                throw Error(`Invalid option ${setting}.`)
            }
        } )
    return _.assign({start: start}, _options, asObject(this), newSettings)
}

function _configure(setting, value){
    return merge.call(this, {
        [setting]: value
    })
}
function configure(setting, value){
    if( _.isPlainObject(setting)){
        return merge.call(this, setting)
    }

    return _configure.call(this, setting, value)
}

module.exports = {
    loadWaiterModule(name) {
        const waiterModule = require(resolver.resolve(name)),
            config = _.assign(waiterModule.defaultOptions(),
                {
                    wait: waiterModule.wait,
                    configure: configure,
                    start: start
                })

        return config
    }
}
