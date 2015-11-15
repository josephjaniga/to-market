"use strict";

var Component = require('./Component.class.js'),
    Physics = require('./Physics.class.js');

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
        this.velocity.x += this.acceleration.x + Physics.gravity.x;
        this.velocity.y += this.acceleration.y + Physics.gravity.y;

        // drag?
        //this.velocity.x *= 0.9;
        //this.velocity.y *= 0.9;

        var t = this.transformRef,
            c = this.colliderRef,
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
                        collisons.x = true;
                    }
                    if (this.AABB(deltaY, objRect)) {
                        collisions.y = true;
                    }
                }
            }
        });
        return collisions;
    }

    ApplyMotion(futureChecks){
        if ( !futureCheck.x ){
            this.entity.transform.position.x += this.velocity.x;
        }

        if ( !futureCheck.y ) {
            this.entity.transform.position.y += this.velocity.y;
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
        if (rect1.position.x < rect2.position.x + rect2.size.x &&
            rect1.position.x + rect1.size.x > rect2.position.x &&
            rect1.position.y < rect2.position.y + rect2.size.y &&
            rect1.size.y + rect1.position.y > rect2.position.y) {
            // collision detected!
            collision = true;
        }
        return collision;
    }
}

module.exports = Rigibody;