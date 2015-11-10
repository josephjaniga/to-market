"use strict";

var Component = require('./Component.class.js');

class Renderer extends Component{
    constructor(options){
        super(options);
        this.Update = ()=>{};
        this.Draw = ()=>{};
        this.name = "Renderer";
        this.type = "Sprite";
        this.image = "filename.png";
        this.color = "#"+((1<<24)*Math.random()|0).toString(16);
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