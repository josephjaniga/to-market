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
}

module.exports = Transform;