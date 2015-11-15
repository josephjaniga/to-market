"use strict";

var Component = require('./Component.class.js');

var Time = { deltaTime: 1 };

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
        var clientId = options.id,
            Transform = null;

        this.speed = 50;

        this.Update = ()=>{

            var KeyState = this.getKeyState();

            if ( Transform == null ){
                Transform = this.entity.GetComponent("Transform");
            }

            if ( KeyState.up ){
                Transform.position.y += this.game.Time.deltaTime * this.speed;
            }
            if ( KeyState.down ){
                Transform.position.y -= this.game.Time.deltaTime * this.speed;
            }
            if ( KeyState.right ){
                Transform.position.x += this.game.Time.deltaTime * this.speed;
            }
            if ( KeyState.left ){
                Transform.position.x -= this.game.Time.deltaTime * this.speed;
            }
        };

        this.Draw = ()=>{};

        this.getKeyState = ()=>{
            return this.game.clients[clientId].inputState.Input.Keys;
        };
    }
}

module.exports = CharacterMotion;