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

function capitalize(s){
    return s.substr(0, 1).toUpperCase() + s.substr(1)
}

function formatPropKey(k){
    const tokens = k.split('-'),
        xformed = tokens.map( (token, n)=>{
            return n > 0 ? capitalize(token) : token
        })
    return xformed.join("")
}

module.exports = {
    parse(commandLine){
        const args = parse(sliceArgs(commandLine));
        const
            moduleArgs = {_: splitArray(args._)},
            pairs = _.pairs( _.assign({}, args, moduleArgs) )

        return _.zipObject( pairs.map((pair)=>{
            return [formatPropKey(pair[0]), pair[1]]
        }))
    },

    //Scoops the arguments past the last - or -- argument. This
    //makes it simple to filter out the node and script path arguments.
    sliceRelevantArguments: sliceArgs,

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