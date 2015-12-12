const shell = require('child_process')

module.exports = function(opts){
    return new Promise( (resolve, reject) => {
        shell.exec(opts.commandLine, {timeout: opts.timeout}, (error, stdout, stderr)=>{
            if( error ){
                reject(error)
            }
            else {
                resolve()
            }
        })
    })
}
