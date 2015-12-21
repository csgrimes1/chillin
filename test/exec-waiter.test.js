const api = require('../src/api')
    , mockery =  require('mockery')
    , execWaiter = require('../src/exec-waiter')
    , _ = require('lodash')
    , cp = require('../src/commandline-parser')
    , sinon = require('sinon')
    , test = require('./support/semantic-tap')(module, {
    beforeEach(config, t){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        mockery.registerMock('child_process', {
            exec: sinon.spy((commandLine, options, callback)=>{
                setTimeout(()=>{
                    const err = commandLine === 'bad'
                        ? new Error('Invalid command')
                        : null;
                    callback(err, null, null)
                }, config.delay || 1)
            })
        })
        return api.loadWaiterModule('exec')
            .configure(_.assign({}, _.pick(config, ['commandLine', 'timeout']), {
                timeout: config.timeout || 5000
            }))
            .start()
    },
    afterEach(){
        mockery.disable()
    }
})

test({commandLine: "echo 'hello'", timeout: 100000}, 'should resolve on simple echo command', function(t, promise){
    t.plan(1)
    promise.then(function(){
        t.pass()
    })
        .catch(function(x){
            console.error(x)
        })
})

test({commandLine: "bad", timeout: 100000}, 'should error on bad command', function(t, promise){
    t.plan(1)
    promise.catch(function(){
        t.pass()
    })
})

test({commandLine: "sleep 100", timeout: 5, delay: 100}, 'should timeout on long command', function(t, promise){
    t.plan(1)
    promise.catch(function(){
        t.pass()
    })
})

//                      0       1            2     3              4       5       6       7
const COMMANDLINE = ['node', 'thisScript', '--', '--timeout', '300000', 'exec', 'echo', 'hello']
    , firstParse = cp.parse(COMMANDLINE)
    , clConfig = execWaiter.adaptCommandLine(firstParse, COMMANDLINE)

test(clConfig, 'should use adapted command line parameters', function(t, promise){
    t.plan(2)
    t.deepEqual(clConfig, {
        timeout: Number(COMMANDLINE[4]),
        commandLine: COMMANDLINE.slice(6).join(' ')
    })
    promise.then(function(){
        t.pass()
    })
})

