"use strict";

class InputState{
    constructor(options){
        this.name = "InputState";

        this.Input = {
            Keys: {
                up: false,
                down: false,
                left: false,
                right: false
            },
            Mouse: {
                left: false,
                right: false,
                middle: false
            }
        };

    }
}

module.exports = InputState;