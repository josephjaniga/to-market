"use strict";

var Transform = require('./Transform.class.js');

class Entity{

    constructor(options){

        this.components = [];

        this.name = options.name || "Entity";

        if ( options.components != null && options.components.length > 0 ){
            options.components.forEach((component)=>{
                this.components.push(component);
            });
        }

        this.Update = ()=>{
            this.components.forEach((component)=>{
                component.Update();
            });
        };

        this.Draw = ()=>{
            this.components.forEach((component)=>{
                component.Draw();
            });
        };

        this.getComponentByName = (name)=>{
            this.components.forEach((component)=>{
                if ( component.name === name ){
                    return component;
                }
            });
            return null;
        };

        this.buildEntityLiteral = ()=>{
            // build position
            var p = {x:-9, y:-9},
                s = {w:3, h:3},
                r = {
                    type: "DEFAULT",
                    image: "DEFAULT_FILE.JPG",
                    color: "#000000"
                },
                transform = this.getComponentByName("Transform"),
                renderer = this.getComponentByName("Renderer");
            if ( transform !== null ){
                p = transform.position;
                s = transform.size;
            }
            if ( renderer !== null ){
                r = renderer.getLiteral();
            }
            return {
                position: p,
                size: s,
                renderer: r
            };
        };

        // the main
        this.components.push( new Transform() );
    }
}

module.exports = Entity;