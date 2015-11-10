"use strict";

module.exports = () => {
    return new Game();
};

class Entity{
    constructor(options){
        this.components = [];
        this.Update = ()=>{
            for ( var i=0; i<this.components.length; i++ ){
                this.components[i].Update();
            }
        };
        this.Draw = ()=>{
            for ( var i=0; i<this.components.length; i++ ){
                this.components[i].Draw();
            }
        };
        this.getComponentByName = (name)=>{
            var needle = null;
            for (var i=0; i<this.components.length; i++){
                if ( this.components[i].name === name ){
                    needle = this.components[i];
                    break;
                }
            }
            return needle;
        };
        this.buildEntityLiteral = ()=>{
            // build position
            var p = {x:0, y:0},
                s = {w:0, h:0},
                r = {
                    type: "DEFAULT",
                    image: "DEFAULT_FILE.JPG",
                    color: "#000000"
                },
                transform = this.getComponentByName("Transform"),
                renderer = this.getComponentByName("Renderer");
            if ( transform !== null ){
                p = transform.position;
                s = transform.size;
            }
            if ( renderer !== null ){
                r = renderer.getLiteral();
            }
            return {
                position: p,
                size: s,
                renderer: r
            };
        };
    }
}

class Component{
    constructor(options){
        this.name = "Component";
        this.Update = ()=>{};
        this.Draw = ()=>{};
    }
}

class Transform extends Component{
    constructor(options){
        super(options);
        this.name = "Transform";
        this.position = {x: 0, y: 0};
        this.size = {w: 0, h: 0};
    }
}

class Renderer extends Component{
    constructor(options){
        super(options);
        this.name = "Renderer";
        this.type = "Sprite";
        this.image = "filename.png"
        this.color = "#FFFFFF";
        this.getLiteral = ()=>{
            return {
                type: this.type,
                image: this.image,
                color: this.color,
            };
        }
    }
}

class Game {
    constructor(options){
        // properties
        this.Input = new Input();
        this.thisFrameTime = new Date().getTime();
        this.lastFrameTime = new Date().getTime();
        this.entities = {};

        // methods
        this.Update = ()=>{
            // frameStart
            //console.log(new Date().getTime());
            this.handleInput();
            setImmediate(this.Update);
        };
        this.playerConnect = (socket)=>{
            this.readyPlayer(socket.id);
        };
        this.playerDisconnect = (socket)=>{
            this.deletePlayer(socket.id);
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
        this.readyPlayer = (id)=>{
            var playerName = id;
            this.entities[playerName] = {
                id: id,
                color:"#"+((1<<24)*Math.random()|0).toString(16),
                y:0,
                x:0,
                keyIsPressed: {
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                }
            };
        };
        this.deletePlayer = (id)=>{
            delete this.entities[id];
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