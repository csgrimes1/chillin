var parse = require('minimist')
    , _ = require('lodash')


function sliceArgs(commandLine){
    const index = Math.max(
        commandLine.lastIndexOf('-'),
        commandLine.lastIndexOf('--')
    )
    if( index >= 0 ){
        return commandLine.slice(index+1)
    }
    return commandLine
}

function splitArray(args) {
    const result = {
        module: args[0]
    }
    if( args.length > 1 ){
        return _.assign({}, result, {args: args.slice(1)})
    }
    return result
}

module.exports = {
    parse(commandLine){
        const args = parse(sliceArgs(commandLine)),
            moduleArgs = {_: splitArray(args._)}

        return _.assign({}, args, moduleArgs)
    },

    REQUIREDARG: {required: true},

    /*  Takes an array of positional args and maps the
        to the keys in the maskObject.
        cp.readPositionalArgs(['a', 'b'], {first, null, second: cp.REQUIREDARG})
            returns
        {first: 'a', second: 'b'}

        The special value REQUIREDARG is fairly intuitive. If the posArgsArray is
        not long enough to set such a value in maskObject, the function will throw
        and error.


    */
    readPositionalArgs(posArgsArray, maskObject){
        const pairs = _.pairs(maskObject),
            merged = _.map(pairs, function(pair, n){
                const positionalValue = posArgsArray[n],
                    effectivePair = positionalValue === undefined ? pair : [pair[0], positionalValue]
                if( Object.is(effectivePair[1], module.exports.REQUIREDARG) ){
                    throw new Error(`Missing required argument ${pair[0]} at index ${n}.`)
                }
                return effectivePair
            })
        return _.zipObject(merged)
    }
}