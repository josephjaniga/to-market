"use strict";

var Component = require('./Component.class.js');

class Transform extends Component{
    constructor(options){
        super(options);
        this.name = "Transform";
        this.position = {x: 0, y: 0};
        this.size = {w: 32, h: 32};
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