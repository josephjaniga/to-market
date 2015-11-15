"use strict";

class Physics{
    constructor(options){
        this.name = "Physics";

        this.gravityEnabled = true;
        this.gravity = {x:0, y:22};
    }
}

module.exports = Physics;