"use strict";

class Client{
    constructor(options){
        this.name = "Client";
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            leftMouseButton: false,
            rightMouseButton: false,
            middleMouseButton: false,
            mouseX: 0,
            mouseY: 0
        };
        this.lastInput = {
            up: false,
            down: false,
            left: false,
            right: false,
            leftMouseButton: false,
            rightMouseButton: false,
            middleMouseButton: false,
            mouseX: 0,
            mouseY: 0
        };
    }
    isFirstKeyPress(name) {
        return this.input[name] && this.input[name] != this.lastInput[name];
    }
    isKeyDown(name) {
        return this.input[name];
    }
}

module.exports = Client;