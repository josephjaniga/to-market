"use strict";

var Component = require('./Component.class.js');

class Rigibody extends Component{
    constructor(options){
        super(options);
        this.name = "Rigidbody";

        //this.transformRef = this.entity.GetComponent("Transform");
        //this.colliderRef = this.entity.GetComponent("Collider");

        this.transformRef = options.transform || null;
        this.colliderRef = options.collider || null;

        /**
         * Kinematic    - determines whether or not this entity can be "moved" by physics
         *              - kinematic entitys (isKinematic = true) will not be moved by physics
         * @type {boolean}
         */
        this.isKinematic = false;
        this.useGravity = true;

        this.velocity = {x:0, y:0};
        this.acceleration = {x:0, y:0};

        this.lastGrounded = false;
        this.grounded = false;
    }

    Step(){
        this.velocity.x += this.acceleration.x + this.game.Physics.gravity.x;
        this.velocity.y += this.acceleration.y + this.game.Physics.gravity.y;

        // drag?
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;

        var t = this.entity.GetComponent("Transform"),
            c = this.entity.GetComponent("Collider"),
            futureCheck = {x: false, y:false};

        // check if new positions have Collision?
        if ( c !== null ){
            var xPositionChange = {
                    x: t.position.x+this.velocity.x,
                    y: t.position.y,
                    w: t.size.x,
                    h: t.size.y
                },
                yPositionChange = {
                    x: t.position.x,
                    y: t.position.y+this.velocity.y,
                    w: t.size.x,
                    h: t.size.y
                };
            futureCheck = this.PredictiveCollisonCheck(xPositionChange, yPositionChange);
        }

        this.ApplyMotion(futureCheck);

    }

    PredictiveCollisonCheck(deltaX, deltaY){
        var collisions = {x: false, y: false};
        this.game.entities.forEach((entity)=>{
            var targetCollider = entity.GetComponent("Collider");
            if ( targetCollider !== null ){
                if ( entity !== this.entity ) {
                    var t2 = entity.GetComponent("Transform"),
                        objRect = {
                            x: t2.position.x,
                            y: t2.position.y,
                            w: t2.size.x,
                            h: t2.size.y
                        };
                    if (this.AABB(deltaX, objRect)) {
                        console.log("HOLY CRAP X COLLISION");
                        collisions.x = true;
                    }
                    if (this.AABB(deltaY, objRect)) {
                        console.log("HOLY CRAP Y COLLISION");
                        collisions.y = true;
                    }
                }
            }
        });
        return collisions;
    }

    ApplyMotion(futureCheck){

        if ( !futureCheck.x ){
            this.entity.GetComponent("Transform").position.x += this.velocity.x * this.game.Time.deltaTime;
        }

        if ( !futureCheck.y ) {
            this.entity.GetComponent("Transform").position.y += this.velocity.y * this.game.Time.deltaTime;
            this.lastGrounded = this.grounded;
            this.grounded = false;
        } else {
            this.lastGrounded = this.grounded;
            this.grounded = true;
        }
    }

    Update(){
        if ( !this.isKinematic ){
            this.Step();
        }
    }

    /**
     * Axis Aligned Bounding Box
     */
    AABB(rect1, rect2){
        var collision = false;
        if (rect1.x < rect2.x + rect2.w &&
            rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h &&
            rect1.h + rect1.y > rect2.y) {
            // collision detected!
            collision = true;
        }
        return collision;
    }
}

module.exports = Rigibody;