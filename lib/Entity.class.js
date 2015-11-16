"use strict";

var Transform = require('./Transform.class.js');

class Entity{

    constructor(options){

        this.components = [];
        this.game = options.game;
        this.garbage = false;
        this.name = options.name || "Entity";

        // the main
        if ( options.components != null && options.components.length > 0 ){
            this.addComponents(options.components);
        }

        this.addComponents( [new Transform({entity:this, game:this.game})] );
    }

    Update(){
        this.components.forEach((component)=>{
            component.Update();
        });
    }

    GetComponent(name){
        var c = null;
        this.components.forEach((component)=>{
            if ( component.name == name ){
                c = component;
            }
        });
        return c;
    }

    addComponents(components){
        var entityParent = this;
        components.forEach((component)=>{
            component.game = entityParent.game;
            component.entity = entityParent;
            entityParent.components.push(component);
        });
    }

    buildEntityLiteral(){
        // build position
        var p = {x:0, y:0},
            s = {w:3, h:3},
            r = {
                type: "DEFAULT",
                image: "DEFAULT_FILE.JPG",
                color: "#000000"
            },
            rb = {
                velocity: {x:0, y:0},
                acceleration: {x:0, y:0}
            },
            transform = this.GetComponent("Transform"),
            renderer = this.GetComponent("Renderer"),
            rigidbody = this.GetComponent("Rigidbody");
        if ( transform !== null ){
            p = transform.position;
            s = transform.size;
        }
        if ( rigidbody !== null ){
            rb.velocity = rigidbody.velocity;
            rb.acceleration = rigidbody.acceleration;
        }
        if ( renderer !== null ){
            r = renderer.getLiteral();
        }
        var componentsList = [];
        this.components.forEach((c)=>{
           componentsList.push(c.name);
        });
        return {
            name: this.name,
            position: p,
            size: s,
            renderer: r,
            rigidbody: rb,
            debug:{
                components: componentsList
            }
        };
    }

}

module.exports = Entity;