const path = require('path')

module.exports = {
    resolve(shortName){
        if( path.isAbsolute(shortName)){
            //Return full absolute path.
            return shortName;
        }
        else if( shortName.startsWith('.')  || shortName.indexOf('/') >= 0 ){
            //Form an absolute path relative to CWD
            return path.normalize(path.join(process.cwd(), shortName))
        }

        //If we got here, we just have a plain name like 'port'.
        //Return a formulated module name from this code folder.
        return `./${shortName}-waiter`;
    }
}
