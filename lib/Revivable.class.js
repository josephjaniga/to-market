"use strict";

class Revivable {
    toJSON(){
        var obj = {},
            self = this;
        for ( let k in self ){
            obj[k] = self[k];
        }
        obj._type = this.constructor.name;
        return obj;
    }
    revive(object){
        for ( let k in object ){
            this[k] = object[k];
        }
        return this;
    }
}

module.exports = Revivable;