"use strict";

var Component = require('./Component.class.js');
var PhysicsEntity = require('./PhysicsEntity.class.js');

class Shoot extends Component {
    constructor(options){
        super(options);

        this.name = "Shoot";
    }

    Update() {
        var client = this.entity.parentClient;
        if(client.isFirstKeyPress("mouseLeft")) {
            // TODO: create bullet
            var parentEntity = this.entity.GetComponent('Transform');
            var bullet = new PhysicsEntity({
                name: "bullet",
                color: 'red',
                useGravity: false,
                isKinematic: false,
                rendererType: "Rectangle",
                // this needs to reference player entity width... couldnt find it... so i estimated
                x: parentEntity.position.x + (client.input.mouseX > (parentEntity.position.x + 16) ? 60 : -20),
                y: parentEntity.position.y,
                w: 10,
                h: 5,
                game: this.entity.game
            });
            var DOC = new DestroyOnCollision();
            bullet.addComponents([DOC]);
            bullet.GetComponent("Rigidbody").acceleration.x = (client.input.mouseX > (parentEntity.position.x + 16) ? 100 : -100);
            this.entity.game.addEntities([bullet]);
        }
    }

    // should know which client / character this is on
    // should know which way character is facing
    // should create bullet object and shoot it
}

module.exports = Shoot;