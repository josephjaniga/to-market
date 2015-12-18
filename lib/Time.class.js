"use strict";

class Time {

    constructor(options) {
        this.options = options;
        this._currentFrameTime = new Date().getTime();
        this._lastFrameTime = new Date().getTime();
        this.step();
    }

    dt(){
        return (this._currentFrameTime - this._lastFrameTime) / 1000;
    };

    step(){
        this._lastFrameTime = this._currentFrameTime;
        this._currentFrameTime = new Date().getTime();
    }

    get deltaTime(){
        return this.dt();
    }

}

module.exports = Time;