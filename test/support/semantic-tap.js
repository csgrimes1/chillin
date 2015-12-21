//Makes tape use before/after semantics
const tap = require('tap')
    , sinon = require('sinon')
    , path = require('path')



function nullfunc(){}

module.exports = function(testModule, options){
    const beforeEach = options.beforeEach || nullfunc,
        afterEach = options.afterEach || nullfunc,
        moduleName = path.basename(testModule.filename, '.test.js')

    return (config, message, callback) => {
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

        tap.test(`MODULE ${moduleName}: ${message}`, tapeCallback)
    }
}
