"use strict";

var Component = require('./Component.class.js');

class Renderer extends Component{
    constructor(options){
        super(options);
        this.name = "Renderer";
        this.type = options.rendererType || "Rectangle";
        this.source = "https://placeholdit.imgix.net/~text?txtsize=47&bg=ff0000&txtclr=ffffff&txt=ABCD&w=300&h=300";
        this.color = options.color || "#"+((1<<24)*Math.random()|0).toString(16);
    }

    getLiteral(){
        return {
            type: this.type,
            source: this.image,
            color: this.color
        };
    }
}

module.exports = Renderer;