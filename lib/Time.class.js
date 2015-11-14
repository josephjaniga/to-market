"use strict";

class Time {
    constructor() {
        this._lastFrameTime = null;
        this.step();
    }

    dt(){
        return (new Date().getTime() - this._lastFrameTime) / 1000;
    };

    step(){
        this._lastFrameTime = new Date().getTime();
    }

    get deltaTime(){
        return this.dt();
    }

}

module.exports = Time;