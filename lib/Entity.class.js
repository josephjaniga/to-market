"use strict";

var Transform = require('./Transform.class.js');

class Entity{

    constructor(options){

        this.components = [];
        this.game = options.game;
        this.garbage = false;
        this.name = options.name || "Entity";
        this.parentClient = options.parentClient || null;

        var x = options.x || 0,
            y = options.y || 0,
            w = options.w || 32,
            h = options.h || 32;

        // the main
        if ( options.components != null && options.components.length > 0 ){
            this.addComponents(options.components);
        }

        var transformComponent = new Transform({
            entity:this,
            game:this.game,
            x: x,
            y: y,
            w: w,
            h: h
        });

        this.addComponents( [transformComponent] );
    }

    Update(){
        this.components.forEach((component)=>{
            component.Update();
        });

        if(this.parentClient != null) {
            this.parentClient.Update();
        }
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
                acceleration: {x:0, y:0},
                lastGrounded: false,
                grounded: false
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
            rb.lastGrounded = rigidbody.lastGrounded;
            rb.grounded = rigidbody.grounded;
        }
        if ( renderer !== null ){
            r = renderer.getLiteral();
        }
        var componentsList = [];
        //this.components.forEach((c)=>{
        //   componentsList.push(c.name);
        //});
        return {
            name: this.name,
            position: p,
            size: s,
            renderer: r,
            rigidbody: rb,
            components: componentsList
        };
    }

}

module.exports = Entity;