"use strict";

var Component = require('./Component.class.js');

class Transform extends Component{
    constructor(options){
        super(options);

        var x = options.x || 0,
            y = options.y || 0,
            w = options.w || 32,
            h = options.h || 32;

        this.name = "Transform";
        this.position = {x: x, y: y};
        this.size = {w: w, h: h};
    }

    Update(){

    }

    GetRectLiteral(){
        return {
            x: this.position.x,
            y: this.position.y,
            w: this.size.w,
            h: this.size.h
        };
    }
}

module.exports = Transform;