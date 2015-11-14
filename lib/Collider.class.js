"use strict";

var Component = require('./Component.class.js');

class Collider extends Component{
    constructor(options){
        super(options);
        this.name = "Collider";

        /**
         * relative position of the collider to the Entity
         * 0,0 - is dead center
         * @type {{x: number, y: number}}
         */
        this.position = {x:0, y:0};

        /**
         * TODO:
         * Draw a debug outline for all colliders in the interface
         */
    }

    Update(){

    }
}

module.exports = Collider;