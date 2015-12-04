"use strict";

var Component = require('./Component.class.js');

class DestroyOnCollision extends Component{
    constructor(options){
        super(options);
        this.name = "DestroyOnCollision";
    }

    Update(){

    }

    OnCollisionEnter(CollidingEntity){
        this.entity.garbage = true;
    }

}

module.exports = DestroyOnCollision;