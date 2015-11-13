"use strict";

var Component = require('./Component.class.js');

class Physics extends Component{
    constructor(options){
        this.name = "Rigidbody";



        this.Update = ()=>{};
        this.Draw = ()=>{};
    }
}

module.exports = Component;