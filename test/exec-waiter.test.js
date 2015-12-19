const api = require('../src/api')
    , proxyquire =  require('proxyquire').noPreserveCache()
    , execWaiter = require('../src/exec-waiter')
    , _ = require('lodash')
    , cp = require('../src/commandline-parser')
    , test = require('./support/semantic-tap')(module, {
    beforeEach(config, t){
        proxyquire('child_process', {})
        return api.loadWaiterModule('exec')
            .configure(_.assign({}, config, {
                timeout: config.timeout || 5000
            }))
            .start()
    }
})

//Note: not mocking command execution unless we stumble across some environment
//where the tests fail.

test({commandLine: "echo 'hello'", timeout: 100000}, 'should resolve on simple echo command', function(t, promise){
    t.plan(1)
    promise.then(function(){
        t.pass()
    })
})

test({commandLine: "....alsdfjal;fj", timeout: 100000}, 'should error on bad command', function(t, promise){
    t.plan(1)
    promise.catch(function(){
        t.pass()
    })
})

test({commandLine: "sleep 100", timeout: 5}, 'should timeout on long command', function(t, promise){
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

