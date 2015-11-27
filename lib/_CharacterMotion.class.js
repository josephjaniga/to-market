"use strict";

var Component = require('./Component.class.js');

/**
 * _CharacterMotion.class.js - BoxGame
 * This is a Custom Class specific to an implementation
 * not centric to the module.
 */

class CharacterMotion extends Component{
    constructor(options){
        super(options);
        this.name = "CharacterMotion";

        // references
        this.clientId = options.id;
        this.Transform = null;

        this.speed = 200;

        this.jumpForce = 250;
        this.jumpDuration = 150;
        this.jumping = false;
        this.jumpEndTime = 0;

        this.getKeyState = ()=>{
            return this.game.clients[this.clientId].input;
        };

        this.bottomCenter = null;
    }

    Update(){

        if ( new Date().getTime() >= this.jumpEndTime ){
            this.jumping = false;
        }

        var KeyState = this.getKeyState();

        if ( this.Transform == null ){
            this.Transform = this.entity.GetComponent("Transform");
        }

        if ( KeyState.up && this.entity.GetComponent("Rigidbody").grounded ){
            this.jumping = true;
            this.jumpEndTime = new Date().getTime() + this.jumpDuration;
        }

        if ( this.jumping ){
            this.entity.GetComponent("Rigidbody").velocity.y -= this.jumpForce;
        } else {
            this.entity.GetComponent("Rigidbody").acceleration.y = 0;
        }

        if ( KeyState.down ){
            //Transform.position.y -= this.game.Time.deltaTime * this.speed;
            this.Raycasting();
        }

        if ( KeyState.right ){
            this.entity.GetComponent("Rigidbody").acceleration.x = this.speed / 2 ;
        } else if ( KeyState.left ){
            this.entity.GetComponent("Rigidbody").acceleration.x = -this.speed / 2;
        } else {
            this.entity.GetComponent("Rigidbody").acceleration.x = 0;
        }

    }

    Raycasting(){

        this.bottomCenter = {
            x: this.Transform.position.x + this.Transform.size.w/2,
            y: this.Transform.position.y + this.Transform.size.h
        };

        this.game.Physics.Raycast({
            point: this.bottomCenter,
            direction: {x: 0, y: 1},
            game: this.game,
            distance: 300
        });

    }
}

module.exports = CharacterMotion;