module.exports = Game;

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