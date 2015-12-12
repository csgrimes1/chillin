const api = require('../src/api')
    , proxyquire =  require('proxyquire').noPreserveCache()
    , execWaiter = require('../src/exec-waiter')
    , _ = require('lodash')
    , test = require('./support/semantic-tape')(module, {
    beforeEach(config, t){
        proxyquire('child_process', {})
        return api.configure({
                timeout: config.timeout || 5000,
                wait: execWaiter.wait
            })
            .start(config)
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

