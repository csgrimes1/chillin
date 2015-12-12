const resolver = require('../src/waiter-resolver')
    , path = require('path')
    , test = require('./support/semantic-tape')(module, {
    beforeEach(config, t){
        return {
            expected: config.expected || config.shortName,
            result: resolver.resolve(config.shortName)
        }
    }
})

test({shortName: 'mock', expected: './mock-waiter'}, 'should resolve mock waiter', function(t, context){
    t.equals(context.result, context.expected)
    t.end()
})

const FULLPATH = '/fee/fi/fo/fum'
test({shortName: FULLPATH, expected: FULLPATH}, 'should resolve absolute pathed waiter', function(t, context){
    t.equals(context.result, context.expected)
    t.end()
})

//Make a relative path based on the process cwd
const RELATIVEPATH = path.relative(process.cwd(), module.filename)
test({shortName: RELATIVEPATH, expected: module.filename}, 'should resolve relative pathed waiter', function(t, context){
        console.log(RELATIVEPATH)
    t.equals(context.result, context.expected)
    t.end()
})
