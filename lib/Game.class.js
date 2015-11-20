"use strict";

var Time = require('./Time.class.js');
var Physics = require('./Physics.class.js');

class Game {

    constructor(options){
        // properties
        this.thisFrameTime = new Date().getTime();
        this.lastFrameTime = new Date().getTime();
        this.entities = [];

        this.debug = [];

        this.Time = new Time();
        this.Physics = new Physics();

        global.Time = this.Time;
        global.Physics = this.Physics;

        // the main
        setImmediate(this.Update, this);
    }

    Update(scope){

        scope.entities.forEach((entity, i)=>{
            if ( entity.garbage ){
                scope.entities.splice(i, 1);
            } else {
                entity.Update();
            }
        });
        scope.Time.step();

        setImmediate(scope.Update, scope);
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

    getRandomColor() {
        var letters = '000ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 9)];
        }
        return color;
    }
}

module.exports = Game;