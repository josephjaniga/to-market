"use strict";

var Revivable = require('./Revivable.class.js');

class Component extends Revivable {

    constructor(options){

        super(options);

        if ( !options ){
            options = {};
        }

        this.options = options;

        this.name = "Component";
        this.entity = options.entity;
        this.game = (this.entity && this.entity.game) ? this.entity.game : options.game;
    }

    Update(){

    }

    OnCollisionEnter(collidingEntity){

    }

}

module.exports = Component;