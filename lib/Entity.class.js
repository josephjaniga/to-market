"use strict";

var Transform = require('./Transform.class.js');

class Entity{

    constructor(options){

        this.options = options;

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

        // update pass
        this.UpdateComponentPassIterator = 0;

        // get pass
        this.GetComponentPassIterator = 0;
        this.c = null;

        // add pass
        this.AddComponentPassIterator = 0;
        this.scope = this;

        // build pass
        this.buildPosition = {x:0, y:0};
        this.buildSize = {w:3, h:3};
        this.buildRenderer = {
            type: "DEFAULT",
            image: "DEFAULT_FILE.JPG",
            color: "#000000"
        };
        this.buildRigidbody = {
            velocity: {x:0, y:0},
            acceleration: {x:0, y:0},
            lastGrounded: false,
            grounded: false
        };
        this.buildTransformComponent = null;
        this.buildRendererComponent = null;
        this.buildRigidbodyComponent = null;
        this.buildReturnObject = {};

        this.addComponents( [transformComponent] );
    }

    _UpdateComponentPass(component){
        component.Update();
    }

    _GetComponentPass(component, name){
        if ( component.name == name ){
            this.c = component;
        }
    }

    _AddComponentPass(component, scope){
        component.game = scope.game;
        component.entity = scope;
        scope.components.push(component);
    }

    _OnCollisionEnterPass(component, collidingEntity){
        component.OnCollisionEnter(collidingEntity);
    }

    Update(){

        for ( this.UpdateComponentPassIterator=0; this.UpdateComponentPassIterator < this.components.length; this.UpdateComponentPassIterator++ ){
            this._UpdateComponentPass(this.components[this.UpdateComponentPassIterator]);
        }

        if(this.parentClient != null) {
            this.parentClient.Update();
        }
    }

    GetComponent(name){
        this.GetComponentPassIterator = 0;
        this.c = null;

        for ( this.GetComponentPassIterator=0; this.GetComponentPassIterator < this.components.length; this.GetComponentPassIterator++ ){
            this._GetComponentPass(this.components[this.GetComponentPassIterator], name);
        }

        return this.c;
    }

    addComponents(components){
        this.scope = this;

        for ( this.AddComponentPassIterator=0; this.AddComponentPassIterator < components.length; this.AddComponentPassIterator++ ){
            this._AddComponentPass(components[this.AddComponentPassIterator], this.scope);
        }
    }

    buildEntityLiteral(){

        this.buildReturnObject = {};

        // build Position data
        this.buildPosition.x = 0;
        this.buildPosition.y = 0;
        // build Size data
        this.buildSize.w = 3;
        this.buildSize.h = 3;
        // build Renderer data
        this.buildRenderer.type = "DEFAULT";
        this.buildRenderer.image = "DEFAULT_FILE.JPG";
        this.buildRenderer.color = "#000000";
        // build Rigidbody data
        this.buildRigidbody.velocity.x = 0;
        this.buildRigidbody.velocity.y = 0;
        this.buildRigidbody.acceleration.x = 0;
        this.buildRigidbody.acceleration.y = 0;
        this.buildRigidbody.lastGrounded = false;
        this.buildRigidbody.grounded = false;
        //build Component Objects
        this.buildTransformComponent = this.GetComponent("Transform");
        this.buildRendererComponent = this.GetComponent("Renderer");
        this.buildRigidbodyComponent = this.GetComponent("Rigidbody");

        if ( this.buildTransformComponent !== null ){
            this.buildPosition.x = this.buildTransformComponent.position.x;
            this.buildPosition.y = this.buildTransformComponent.position.y;
            this.buildSize.w = this.buildTransformComponent.size.w;
            this.buildSize.h = this.buildTransformComponent.size.h;
        }
        if ( this.buildRigidbodyComponent !== null ){
            this.buildRigidbody.velocity.x = this.buildRigidbodyComponent.velocity.x;
            this.buildRigidbody.velocity.y = this.buildRigidbodyComponent.velocity.y;
            this.buildRigidbody.acceleration.x = this.buildRigidbodyComponent.acceleration.x;
            this.buildRigidbody.acceleration.y = this.buildRigidbodyComponent.acceleration.y;
            this.buildRigidbody.lastGrounded = this.buildRigidbodyComponent.lastGrounded;
            this.buildRigidbody.grounded = this.buildRigidbodyComponent.grounded;
        }
        if ( this.buildRendererComponent !== null ){
            this.buildRenderer = this.buildRendererComponent.getLiteral();
        }

        //var componentsList = [];
        //this.components.forEach((c)=>{
        //   componentsList.push(c.name);
        //});

        this.buildReturnObject.name = this.name;
        this.buildReturnObject.position = this.buildPosition;
        this.buildReturnObject.size = this.buildSize;
        this.buildReturnObject.renderer = this.buildRenderer;
        this.buildReturnObject.rigidbody = this.buildRigidbody;

        return this.buildReturnObject;
    }

    OnCollisionEnter(collidingEntity){
        for ( this.UpdateComponentPassIterator=0; this.UpdateComponentPassIterator < this.components.length; this.UpdateComponentPassIterator++ ){
            this._OnCollisionEnterPass(this.components[this.UpdateComponentPassIterator], collidingEntity);
        }
    }

    getRect(){
        var rect = null,
            t = this.GetComponent("Transform");
        if ( t !== null ){
            rect = {
                x: t.position.x,
                y: t.position.y,
                w: t.size.w,
                h: t.size.h,
                ref: this
            };
        }
        return rect;
    }

}

module.exports = Entity;