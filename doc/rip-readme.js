const cp = require('../src/commandline-parser')
    , commandLine = cp.sliceRelevantArguments(process.argv)
    , fs = require('fs')
    , regex = /\s*\#include\s+(.*)/
    , data = fs.readFileSync(commandLine[0])
        .toString()
        .replace('\r', '')
        .split('\n')
        .map( line => {
            const match = regex.exec(line)
            console.log( (match
                ? fs.readFileSync(match[1]).toString()
                : line) )
        })
