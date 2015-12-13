const test = require('./support/semantic-tape')(module, {
        beforeEach(config, t){
            return config
        }
    }),
    cp = require('../src/commandline-parser')

//                         0           1         2    3     4    5     6       7             8          8
const COMMANDLINE = ['/path/node', 'theModule', '-', '--', '-', '-a', '1', 'some-module', 'posarg1', 'posarg2']
test({}, 'should parse command line into positional args and options with module args', function(t, context){
    const result = cp.parse(COMMANDLINE),
        expect = {
            _: {module: COMMANDLINE[7], args: COMMANDLINE.slice(8)},
            a: Number(COMMANDLINE[6])
        }
    t.deepEqual(result, expect)
    t.end()
})

test({}, 'should parse command line into positional args and options with undefined module args', function(t, context){
    const result = cp.parse(COMMANDLINE.slice(0, 8)),
        expect = {
            _: {module: COMMANDLINE[7]},
            a: Number(COMMANDLINE[6])
        }
    t.deepEqual(result, expect)
    t.end()
})

test({}, 'should camel-case multiple token options', function(t, context){
    const result = cp.parse(COMMANDLINE.slice(0, 8).map( (v, n) => {
            return 5===n ? '--camel-case' : v
        })),
        expect = {
            _: {module: COMMANDLINE[7]},
            camelCase: Number(COMMANDLINE[6])
        }
    t.deepEqual(result, expect)
    t.end()
})


const POSITIONALARGS = ['a', 'b', 'c']
test({}, 'should interpret positional args into named options', function(t, context){
    const result = cp.readPositionalArgs(POSITIONALARGS, {first:null,second:null,third:null}),
        expect = {first:'a',second:'b',third:'c'}
    t.deepEqual(result, expect)
    t.end()
})

test({}, 'should throw upon missing required positional arguments', function(t, context){
    t.plan(1)
    try {
        cp.readPositionalArgs(POSITIONALARGS, {
            first: null,
            second: null,
            third: null,
            fourth: cp.REQUIREDARG
        })
        t.fail('Should have thrown exception')
    }
    catch(x){
        t.pass()
    }
})

