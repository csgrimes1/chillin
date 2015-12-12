const parser = require('./commandline-parser')

console.dir(process.argv)
console.log( parser.parse(process.argv))

