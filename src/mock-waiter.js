module.exports = {
    wait(waitInMs){
        return new Promise((resolve, reject) => {
            setTimeout(resolve, waitInMs || 0);
        })
    }
}