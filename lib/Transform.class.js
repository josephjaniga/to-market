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

        this.literal = {
            x: this.position.x,
            y: this.position.y,
            w: this.size.w,
            h: this.size.h
        };
    }

    Update(){

    }

    GetRectLiteral(){
        this.literal.x = this.position.x;
        this.literal.y = this.position.y;
        this.literal.w = this.size.w;
        this.literal.h = this.size.h;
        return this.literal;
    }
}

module.exports = Transform;