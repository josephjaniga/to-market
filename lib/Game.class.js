"use strict";

var Time = require('./Time.class.js');
var Physics = require('./Physics.class.js');

class Game {
    constructor(options){
        // properties
        this.thisFrameTime = new Date().getTime();
        this.lastFrameTime = new Date().getTime();
        this.entities = [];

        this.Time = new Time();
        this.Physics = new Physics();

        // the main
        setImmediate(this.Update);
    }

    Update(){
        this.entities.forEach((entity, i)=>{
            if ( entity.garbage ){
                this.entities.splice(i, 1);
            } else {
                entity.Update();
            }
        });
        this.Time.step();
        setImmediate(this.Update);
    }

    getEntityByName(name){
        var result = null;
        this.entities.forEach((entity)=>{
            if ( entity.name == name ){
                result = entity;
            }
        });
        return result;
    }

    getEntityLiterals(){
        var list = [];
        for(var i=0; i<this.entities.length; i++){
            list.push(this.entities[i].buildEntityLiteral());
        }
        return list;
    }

    addEntities(entities){
        entities.forEach((entity)=>{
            entity.game = this;
            this.entities.push(entity);
        });
    }

}

module.exports = Game;