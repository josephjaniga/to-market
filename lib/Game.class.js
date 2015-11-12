"use strict";

var Time = require('./Time.class.js');

class Game {
    constructor(options){
        // properties
        this.thisFrameTime = new Date().getTime();
        this.lastFrameTime = new Date().getTime();
        this.entities = [];

        this.Time = new Time();

        // methods
        this.Update = ()=>{
            this.entities.forEach((entity, i)=>{
                if ( entity.garbage ){
                    this.entities.splice(i, 1);
                } else {
                    entity.Update();
                }
            });
            this.Time.step();
            setImmediate(this.Update);
        };

        this.getEntityByName = (name)=>{
            var result = null;
            this.entities.forEach((entity)=>{
                if ( entity.name == name ){
                    result = entity;
                }
            });
            return result;
        };

        this.getEntityLiterals = ()=>{
            var list = [];
            for(var i=0; i<this.entities.length; i++){
                list.push(this.entities[i].buildEntityLiteral());
            }
            return list;
        };

        this.addEntities = (entities)=>{
            entities.forEach((entity)=>{
                entity.game = this;
                this.entities.push(entity);
            });
        };

        // the main
        setImmediate(this.Update);
    }
}

module.exports = Game;