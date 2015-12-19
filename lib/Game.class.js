"use strict";

var Time = require('./Time.class.js'),
    Physics = require('./Physics.class.js'),
    Quadtree = require('./Quadtree.class.js'),
    Revivable = require('./Revivable.class.js');

class Game extends Revivable {

    constructor(options){
        super(options);
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

        // the Game Loop
        if ( typeof setImmediate == 'function' ){
            // if we have access to setImmediate use it
            setImmediate(this.Update, this);
        } else {
            // else use timeout at 60hz
            setTimeout(this.Update.bind(this, this), 16);
        }
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

        scope.debug = scope.quad.getBounds();

        scope.Time.step();

        if ( typeof setImmediate == 'function' ){
            // if we have access to setImmediate use it
            setImmediate(scope.Update, scope);
        } else {
            // else use timeout at 60hz
            setTimeout(scope.Update.bind(scope, scope), 16);
        }
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