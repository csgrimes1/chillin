const api = require('../src/api')
    , EventEmitter = require('events')
    , BAD = "FAKE ERROR"
    , parser = require('../src/commandline-parser')
    , _ = require('lodash')
    , sinon = require('sinon')
    , mockery = require('mockery')

const test = require('./support/semantic-tap')(module, {
    beforeEach(cfg, t){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        const
            config = cfg || {},
            netMock = {
                connect: sinon.spy((options, onConnect)=> {
                    var sink = new EventEmitter()
                        , timer = 0
                    const
                        callback = config.callback || (() => setTimeout(() => onConnect(), 5)),
                        client = {
                            _ : options,
                            _errorEmitter: sink,
                            _onConnect: onConnect,
                            end(){
                                clearTimeout(timer)
                            },
                            setTimeout(ms, callback){
                                timer = global.setTimeout(()=>{
                                    callback()
                                }, ms)
                            },
                            on(evt, arg1, arg2){
                                sink.on(evt, arg1, arg2)
                            }
                        }
                    callback(client)
                    return client
                })
            },
            opts = {
                host: config.host || "",
                port: config.port || 5432,
                timeout: config.timeout || 5000
            }

        mockery.registerMock('net', netMock)
        require('net')
        return api.loadWaiterModule('port')
            .configure(opts)
            .start( )
            .then((r)=>{
                return _.assign(r || {}, {_: netMock})
            }, (r)=>{
                throw _.assign(r || {}, {_: netMock})
            })
    }
    , afterEach(){
        mockery.disable()
    }
})

test(null, 'should resolve promise upon reaching address:port endpoint', function(t, promise){
    t.plan(1)
    promise.then(function()
    {
        t.pass()
    }, function(x){
        console.error(x);
        t.fail()
    })
})

const flipper = require('./support/flip-once-toggle').create(false)
function makeConnRefused(){
    return _.assign(
        new Error('ECONNREFUSED'),
        {code: 'ECONNREFUSED'}
    )
}
function callbackForcingRetry(client){
    setTimeout( () => {
        if (!flipper.value() ) {
            client._errorEmitter.emit('error', makeConnRefused())
        }
        else {
            client._onConnect()
        }
    }, 1)
}
test({callback: callbackForcingRetry, timeout: 100000, retryInterval: 1000},
        'should resolve promise after retrying connection', function(t, promise){
    t.plan(1)
    promise.then(function()
    {
        t.pass()
    })
})

test({callback(){ setTimeout(()=>{}, 20)}, timeout: 1, retryInterval: 1}, 'should time out', function(t, promise){
    t.plan(1)
    promise.catch(function(x)
    {
        t.pass()
    })
})
//
//test({callback(){ setTimeout(()=>{}, 20)}, timeout: 1, retryInterval: 1}, 'should time out on timeout event', function(t, promise){
//    t.plan(1)
//    promise.catch(function(x)
//    {
//        t.pass()
//    })
//})


function makeError(client){
    setTimeout( () => {
        client._errorEmitter.emit('error', new Error('BAD'))
    }, 1)
}
test({callback: makeError, timeout: 100000}, 'should error out on socket error', function(t, promise){
    t.plan(1)
    promise
        .catch(function(x)
        {
            t.pass()
        })
})
//                     0         ¡           2     3          4              5       6           7
const COMMANDLINE = ['node', 'thisScript', '--', 'port', 'www.google.com', '80', '--timeout', '100000']
    , rawCommandLine = parser.parse(COMMANDLINE)
    , portWaiter = require('../src/port-waiter')
    , config = _.assign({}, portWaiter.adaptCommandLine(rawCommandLine))
test(config, 'should adapt command line arguments to runnable options', function(t, promise){
    t.plan(2)

    promise.then(function(result){
        const mockApi = result._
            , args = mockApi.connect.args[0][0]
        t.assert(mockApi.connect.called)
        t.deepEqual(args, {host: COMMANDLINE[4], port: Number(COMMANDLINE[5]), timeout: Number(COMMANDLINE[7])})
    })
    .catch(function(x){
        t.fail(x + ' ' + x.stack)
    })
    .then(function(){
        waitSpy.restore()
    })
})
