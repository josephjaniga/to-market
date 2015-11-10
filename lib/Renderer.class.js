"use strict";

var Component = require('./Component.class.js');

class Renderer extends Component{
    constructor(options){
        super(options);
        this.name = "Renderer";
        this.type = "Sprite";
        this.image = "filename.png"
        this.color = "#FFFFFF";
        this.getLiteral = ()=>{
            return {
                type: this.type,
                image: this.image,
                color: this.color,
            };
        }
    }
}

module.exports = Renderer;