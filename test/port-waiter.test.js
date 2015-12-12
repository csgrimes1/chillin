const tape = require('tape')
    , api = require('../src/api')
    , proxyquire =  require('proxyquire').noPreserveCache().noCallThru()
    , sinon = require('sinon')
    , EventEmitter = require('events')
    , BAD = "FAKE ERROR"


function beforeEach(config, t){
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
}

function afterEach(t, context){

}

function test(config, message, callback){
    const tapeCallback = t => {
        const context = beforeEach(config, t)
        var oldEnd = t.end,
            stub = sinon.stub(t, 'end', () => {
                afterEach(t, context)
                oldEnd()
                sinon.restore()
            })

        callback(t, context)
    }

    tape(message, tapeCallback)
}

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
