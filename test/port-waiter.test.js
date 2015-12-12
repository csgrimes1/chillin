const api = require('../src/api')
    , proxyquire =  require('proxyquire').noPreserveCache().noCallThru()
    , EventEmitter = require('events')
    , BAD = "FAKE ERROR"

const test = require('./support/semantic-tape')(module, {
    beforeEach(config, t){
        const portWaiter = proxyquire('../src/port-waiter', {
            net: {
                connect(options, onConnect){
                    var sink = new EventEmitter()
                    if( config.doesError ){
                    }
                    else if( config.doesConnect ){
                        setTimeout(() => onConnect(), 5)
                    }
                    else {
                        //Cause a delay
                    }
                    return {
                        end(){},
                        on(evt, arg1, arg2){
                            sink.on(evt, arg1, arg2)
                            if( config.doesError ) {
                                setTimeout(() => {
                                    sink.emit('error', new Error(BAD))
                                }, 25)
                            }
                        }
                    }
                }
            }
        })

        return api.configure({
                timeout: config.timeout || 5000,
                waiter: portWaiter
            })
            .start({host: "", port: 0})
    },

    afterEach(t, context){

    }

})

test({doesConnect: true}, 'should resolve promise upon reaching address:port endpoint', function(t, promise){
    t.plan(1)
    promise.then()
    {
        t.pass()
    }
})

test({doesConnect: false, timeout: 1}, 'should time out', function(t, promise){
    t.plan(1)
    promise.catch(function(x)
    {
        t.pass()
    })
})

test({doesError: true, timeout: 100000}, 'should error out on socket error', function(t, promise){
    t.plan(1)
    promise
        .catch(function(x)
        {
            t.pass()
        })
})
