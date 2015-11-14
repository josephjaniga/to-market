"use strict";

var Component = require('./Component.class.js');

class Transform extends Component{
    constructor(options){
        super(options);
        this.name = "Transform";
        this.position = {x: 100, y: 100};
        this.size = {w: 32, h: 32};
    }
    Update(){

    }
}

module.exports = Transform;