"use strict";

class Game {
    constructor(options){
        // properties
        this.thisFrameTime = new Date().getTime();
        this.lastFrameTime = new Date().getTime();
        this.entities = [];

        // methods
        this.Update = ()=>{
            for ( var i=0; i<this.entities.length; i++ ){
                this.entities[i].Update();
            }
            setImmediate(this.Update);
        };

        this.getEntityByName = (name)=>{
            var needle = null;
            for ( var i=0; i<this.entities.length; i++ ){
                if ( this.entities[i].name === name ){
                    needle = this.entities[i];
                    break;
                }
            }
            return needle;
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