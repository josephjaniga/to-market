"use strict";

var Component = require('./Component.class.js');

class DestroyAfterTime extends Component{
    constructor(options){
        super(options);
        this.name = "DestroyAfterTime";
        this.startTime = Time._currentFrameTime;
    }

    Update(){
        if ( Time._currentFrameTime >= this.startTime + 5000  ){
            this.entity.garbage = true;
        }
    }

}

module.exports = DestroyAfterTime;