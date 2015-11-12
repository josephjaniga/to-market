"use strict";

class Time {

    constructor() {
        this._lastFrameTime = null;

        this.dt = ()=>{
            return (new Date().getTime() - this._lastFrameTime) / 1000;
        };

        this.step = ()=>{
            this._lastFrameTime = new Date().getTime();
        };

        this.step();
    }

    get deltaTime(){
        return this.dt();
    }

}

module.exports = Time;