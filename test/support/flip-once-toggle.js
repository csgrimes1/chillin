module.exports = {
    create(initialValue){
        //Should return the initial value exactly once
        return {
            callcount: 0,
            _v: initialValue,
            value(){
                //Here we isolate a small, unfortunate episode of mutability!
                return this.callcount++ == 0
                    ? initialValue
                    : !initialValue
            }
        }
    }
}
