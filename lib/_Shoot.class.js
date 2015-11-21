"use strict";

var Component = require('./Component.class.js');

class Shoot extends Component {
    constructor(options){
        super(options);

        this.name = "Shoot";
    }

    Update() {
        var client = this.entity.parentClient;
        if(client.isFirstKeyPress("leftMouseButton")) {
            // TODO: create a bullet entity
            console.log('left mouse button pressed');
        }
    }

    // should know which client / character this is on
    // should know which way character is facing
    // should create bullet object and shoot it
}

module.exports = Shoot;