"use strict";

class Game {
    constructor(options){
        // properties
        this.thisFrameTime = new Date().getTime();
        this.lastFrameTime = new Date().getTime();
        this.entities = {};

        // methods
        this.Update = ()=>{
            this.handleInput();
            setImmediate(this.Update);
        };
        this.getNameOfPlayerById = (id)=>{
            var playerName = null;
            for ( var property in this.entities ){
                if ( this.entities[property].id === id ){
                    playerName = property;
                    break;
                }
            }
            return playerName;
        };
        this.handleInput = ()=>{
            this.thisFrameTime = new Date().getTime();
            var deltaTime = (this.thisFrameTime - this.lastFrameTime) / 1000,
                speed = 50 * deltaTime;
            for ( var property in this.entities ){
                if ( this.entities[property].keyIsPressed.up ){
                    this.entities[property].y += speed;
                }
                if ( this.entities[property].keyIsPressed.down ){
                    this.entities[property].y -= speed;
                }
                if ( this.entities[property].keyIsPressed.right ){
                    this.entities[property].x += speed;
                }
                if ( this.entities[property].keyIsPressed.left ){
                    this.entities[property].x -= speed;
                }
            }
            this.lastFrameTime = this.thisFrameTime;
        };
        this.keyStateChange = (keyState, socket)=>{
            var playerString = this.getNameOfPlayerById(socket.id);
            if ( playerString !== null ){
                this.entities[playerString].keyIsPressed = keyState;
            }
        };
        this.getEntityLiterals = ()=>{
            var list = [];
            for(var i=0; i<this.entities.length; i++){
                list.push(this.entities[i].buildEntityLiteral());
            }
            return list;
        };

        // the main
        setImmediate(this.Update);
    }
}

module.exports = Game;