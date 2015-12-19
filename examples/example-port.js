const whenWarm = require('when-warm')
    , promise = whenWarm.loadWaiterModule('port')
        .configure('host', 'www.google.com')
        .configure('port', 80)
        .start()

promise.then(function(){
    console.log('OK!')
}, function(x){
    console.error(`Failed: ${x}`)
})
