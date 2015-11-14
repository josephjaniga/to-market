"use strict";

class Component{
    constructor(options){
        if ( !options ){
            options = {};
        }
        this.name = "Component";
        this.entity = options.entity;
        this.game = (this.entity && this.entity.game) ? this.entity.game : options.game;
    }

    Update(){

    }
}

module.exports = Component;