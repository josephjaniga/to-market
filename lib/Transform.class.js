"use strict";

var Component = require('./Component.class.js');

class Transform extends Component{
    constructor(options){
        super(options);
        this.name = "Transform";
        this.position = {x: 0, y: 0};
        this.size = {w: 0, h: 0};
    }
}

module.exports = Transform;