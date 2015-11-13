"use strict";

var Transform = require('./Transform.class.js');

class Entity{

    constructor(options){

        this.components = [];
        this.game = options.game;
        this.garbage = false;
        this.name = options.name || "Entity";

        this.Update = ()=>{
            this.components.forEach((component)=>{
                component.Update();
            });
        };

        //this.Draw = ()=>{
        //    this.components.forEach((component)=>{
        //        component.Draw();
        //    });
        //};

        this.getComponentByName = (name)=>{
            var c = null;
            this.components.forEach((component)=>{
                if ( component.name == name ){
                    c = component;
                }
            });
            return c;
        };

        this.addComponents = (components)=>{
            var entityParent = this;
            components.forEach((component)=>{
                component.game = entityParent.game;
                component.entity = entityParent;
                entityParent.components.push(component);
            });
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
        if ( options.components != null && options.components.length > 0 ){
            this.addComponents(options.components);
        }

        this.addComponents( [new Transform({entity:this, game:this.game})] );
    }
}

module.exports = Entity;