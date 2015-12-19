const test = require('./support/semantic-tap')(module, {})
    , api = require('../src/api')
    , mockWaiterModule = require('../src/mock-waiter')
    , mockWaiter = mockWaiterModule.wait

test({}, 'basic semantics should lead to resolving promise', function(t){
    api.loadWaiterModule('mock')
        .configure('timeout', 5000)
        .configure('wait', mockWaiter)
        .start()
        .then(function(){
            t.assert(true, 'Basic test had resolved promise')
            t.end()
        })
})

test({}, 'object semantics should lead to resolving promise', function(t){
    api.loadWaiterModule('mock')
        .configure({
            timeout: 5000,
            mockSetting: 2
        })
        .configure("wait", mockWaiter)
        .start()
        .then(function(){
            t.assert(true, 'Basic test had resolved promise')
            t.end()
        })
})

test({}, 'should time out on long wait', function(t){
    api .loadWaiterModule('mock')
        .configure("timeout", 1)
        .configure("wait", () => mockWaiter(2000))
        .start()
        .catch(function(x){
            t.assert(x.toString().match(/timeout/i), 'Timeout message received')
            t.end()
        })
})

test({}, 'should error out on bad parameter', function(t){
    try {
        api.configure('mom', 0)
        t.fail('Should have thrown exception')
    }
    catch(x){
        t.assert(x != null, 'Exception caught as expected')
        t.end()
    }
})
