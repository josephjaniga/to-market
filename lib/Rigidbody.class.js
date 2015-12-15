"use strict";

var Component = require('./Component.class.js');

class Rigidbody extends Component{
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
        this.noGravVelocity = {x:0, y:0};

        this.lastGrounded = false;
        this.grounded = false;

        /**
         * dirty state Properties to eliminate new variable creation
         */
        this.futureCheck = {
            x: false,
            y: false,
            grounded: false,
            dx: null,
            dy: null
        };

        this.xPositionChange = {x: 0, y: 0, w: 0, h: 0};
        this.yPositionChange = {x: 0, y: 0, w: 0, h: 0};

        this.t = null;
        this.c = null;

        this.targetCollider = null;
        this.t2 = null;
        this.objRect = {x: 0, y: 0, w: 0, h: 0};
        this.down = {x: 0, y: 0, w: 0, h: 0};

        this.AABBcollision = false;

        this.colliding = false;
        this.lastColliding = false;

        this.colllidingObject = null;
    }

    Step(){

        this.noGravVelocity.x += this.acceleration.x;
        this.noGravVelocity.y += this.acceleration.y;

        this.velocity.x += this.acceleration.x + Physics.gravity.x;
        this.velocity.y += this.acceleration.y + Physics.gravity.y;

        // drag?
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;

        this.noGravVelocity.x *= 0.9;
        this.noGravVelocity.y *= 0.9;

        if ( this.t == null ){
            this.t = this.entity.GetComponent("Transform");
        }
        if ( this.c == null ){
            this.c = this.entity.GetComponent("Collider");
        }

        this.ResetFutureCheck();

        // check if new positions have Collision?
        if ( this.c !== null ){

            if ( this.useGravity ){
                this.xPositionChange.x = this.t.position.x + this.noGravVelocity.x * Time.deltaTime;
                this.yPositionChange.y = this.t.position.y + this.velocity.y * Time.deltaTime;
            } else {
                this.xPositionChange.x = this.t.position.x + this.noGravVelocity.x * Time.deltaTime;
                this.yPositionChange.y = this.t.position.y + this.noGravVelocity.y * Time.deltaTime;
            }

            //this.xPositionChange.x = this.t.position.x + this.noGravVelocity.x * Time.deltaTime;
            this.xPositionChange.y = this.t.position.y;
            this.xPositionChange.w = this.t.size.w;
            this.xPositionChange.h = this.t.size.h;

            this.yPositionChange.x = this.t.position.x;
            //this.yPositionChange.y = this.t.position.y + this.velocity.y * Time.deltaTime;
            this.yPositionChange.w = this.t.size.w;
            this.yPositionChange.h = this.t.size.h;

            this.PredictiveCollisonCheck(this.xPositionChange, this.yPositionChange);
        }

        this.ApplyMotion(this.futureCheck);

    }

    PredictiveCollisonCheck(deltaX, deltaY){

        this.ResetFutureCheck();
        this.futureCheck.dx = deltaX,
        this.futureCheck.dy = deltaY;

        //get the entities to compare from the quad tree
        var rectOutput = [],
            entityOutput = [];
        rectOutput = this.game.quad.retrieve(rectOutput, this.entity.getRect());

        rectOutput.forEach((rect)=>{
            if ( rect.ref !== null && rect.ref !== undefined ){
                entityOutput.push(rect.ref);
            }
        });

        //console.log(entityOutput.length);
        //console.log(rectOutput.length + " " + entityOutput.length);

        entityOutput.forEach((entity)=>{
            this.t = this.entity.GetComponent("Transform");
            this.targetCollider = entity.GetComponent("Collider");

            if ( this.targetCollider !== null ){
                if ( entity.name !== this.entity.name ) {

                    this.t2 = entity.GetComponent("Transform");

                    this.objRect.x = this.t2.position.x;
                    this.objRect.y = this.t2.position.y;
                    this.objRect.w = this.t2.size.w;
                    this.objRect.h = this.t2.size.h;

                    this.down.x = this.t.position.x;
                    this.down.y = this.t.position.y + 3;
                    this.down.w = this.t.size.w;
                    this.down.h = this.t.size.h;

                    if (this.AABB(deltaX, this.objRect)) {
                        this.futureCheck.x = true;
                        this.colllidingObject = entity;
                    }
                    if (this.AABB(deltaY, this.objRect)) {
                        this.futureCheck.y = true;
                        this.colllidingObject = entity;
                    }
                    if (this.AABB(this.down, this.objRect)) {
                        this.futureCheck.grounded = true;
                    }
                }
            }
        });
    }

    ApplyMotion(futureCheck){

        if ( this.t == null ){
            this.t = this.entity.GetComponent("Transform");
        }

        if ( !futureCheck.x ){
            this.t.position.x = futureCheck.dx.x;
        }

        if ( !futureCheck.y ) {
            this.t.position.y = futureCheck.dy.y;
        }

        this.lastGrounded = this.grounded;
        this.grounded = futureCheck.grounded;

        if (
            (futureCheck.x || futureCheck.y) &&
            this.colllidingObject !== null
        ){
            if ( !this.colliding ){
                this.entity.OnCollisionEnter(this.colllidingObject);
                this.colliding = true;
            }
        } else {
            this.colliding = false;
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
        this.AABBcollision = false;
        if (rect1.x < rect2.x + rect2.w &&
            rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h &&
            rect1.h + rect1.y > rect2.y) {
            // collision detected!
            this.AABBcollision = true;
        }
        return this.AABBcollision;
    }

    ResetFutureCheck (){
        this.futureCheck.x = false,
        this.futureCheck.y = false,
        this.futureCheck.grounded = false,
        this.futureCheck.dx = null,
        this.futureCheck.dy = null;
    }
}

module.exports = Rigidbody;