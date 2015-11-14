"use strict";

var Component = require('./Component.class.js');

class Rigibody extends Component{
    constructor(options){
        super(options);
        this.name = "Rigidbody";

        /**
         * Kinematic    - determines whether or not this object can be "moved" by physics
         *              - kinematic objects (isKinematic = true) will not be moved by physics
         * @type {boolean}
         */
        this.isKinematic = false;
        this.useGravity = true;
    }
    Update(){

    }
}

module.exports = Rigibody;