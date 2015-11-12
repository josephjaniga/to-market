"use strict";

var InputState = require('./InputState.class.js');

class Client{
    constructor(options){
        this.name = "Client";
        this.inputState = new InputState(options.id);
    }
}

module.exports = Client;