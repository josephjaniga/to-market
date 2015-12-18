"use strict";

var Time = require('./Time.class.js'),
    Physics = require('./Physics.class.js'),
    Quadtree = require('./Quadtree.class.js');

class Game {

    constructor(options){

        this.options = options;

        // properties
        this.thisFrameTime = new Date().getTime();
        this.lastFrameTime = new Date().getTime();

        this.dynamicEntities = [];
        this.staticEntities = [];

        this.debug = [];

        this.quad = new Quadtree({
            level: 0,
            bounds: {
                x: -525,
                y: -350,
                w: 1050,
                h: 700
            }
        });

        this.Time = new Time();
        this.Physics = new Physics();

        global.Time = this.Time;
        global.Physics = this.Physics;
        global.dd = (msg)=>{
            if ( !!msg ){
                console.log(msg);
                throw new Error();
            }
        };

        // the main
        setImmediate(this.Update, this);
    }

    get entities () {
        return this.dynamicEntities.concat(this.staticEntities);
    }

    Update(scope){

        var tempEntitiesList = [];
        if ( scope.entities != null ){
            tempEntitiesList = scope.entities;
        }
        scope.quad.clear();
        for ( var i=0; i < tempEntitiesList.length; i++) {
            scope.quad.insert(tempEntitiesList[i].getRect());
        }

        scope.dynamicEntities.forEach((entity, i)=>{
            if ( entity.garbage ){
                scope.dynamicEntities.splice(i, 1);
            } else {
                entity.Update();
            }
        });

        //scope.debug = [];
        scope.debug = scope.quad.getBounds();

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
        for(var i=0; i<this.dynamicEntities.length; i++){
            list.push(this.dynamicEntities[i].buildEntityLiteral());
        }
        return list;
    }

    getStaticLiterals(){
        var list = [];
        for(var i=0; i<this.staticEntities.length; i++){
            list.push(this.staticEntities[i].buildEntityLiteral());
        }
        return list;
    }

    addEntities(entities){
        entities.forEach((entity)=>{
            entity.game = this;
            this.dynamicEntities.push(entity);
        });
    }

    addStaticEntities(entities){
        entities.forEach((entity)=>{
            entity.game = this;
            this.staticEntities.push(entity);
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