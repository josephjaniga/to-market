"use strict";

// SHIMS ------------------------------
var global = window;
//function setImmediate(){}

// Revivable.class.js ------------------------------

class Revivable {
    toJSON(){
        var obj = {},
            self = this;
        for ( let k in self ){
            obj[k] = self[k];
        }
        obj._type = this.constructor.name;
        return obj;
    }
    revive(object){
        for ( let k in object ){
            this[k] = object[k];
        }
        return this;
    }
}



// Component.class.js ------------------------------


class Component extends Revivable {

    constructor(options){

        super(options);

        if ( !options ){
            options = {};
        }

        this.options = options;

        this.name = "Component";
        this.entity = options.entity;
        this.game = (this.entity && this.entity.game) ? this.entity.game : options.game;
    }

    Update(){

    }

    OnCollisionEnter(collidingEntity){

    }

}



// Transform.class.js ------------------------------


class Transform extends Component{
    constructor(options){
        super(options);

        var x = options.x || 0,
            y = options.y || 0,
            w = options.w || 32,
            h = options.h || 32;

        this.name = "Transform";
        this.position = {x: x, y: y};
        this.size = {w: w, h: h};

        this.literal = {
            x: this.position.x,
            y: this.position.y,
            w: this.size.w,
            h: this.size.h
        };
    }

    Update(){

    }

    GetRectLiteral(){
        this.literal.x = this.position.x;
        this.literal.y = this.position.y;
        this.literal.w = this.size.w;
        this.literal.h = this.size.h;
        return this.literal;
    }
}



// Entity.class.js ------------------------------


class Entity extends Revivable {

    constructor(options){
        super(options);
        this.options = options;

        this.components = [];
        this.game = options.game;
        this.garbage = false;
        this.name = options.name || "Entity";
        this.parentClient = options.parentClient || null;

        var x = options.x || 0,
            y = options.y || 0,
            w = options.w || 32,
            h = options.h || 32;

        // the main
        if ( options.components != null && options.components.length > 0 ){
            this.addComponents(options.components);
        }

        var transformComponent = new Transform({
            entity:this,
            game:this.game,
            x: x,
            y: y,
            w: w,
            h: h
        });

        // update pass
        this.UpdateComponentPassIterator = 0;

        // get pass
        this.GetComponentPassIterator = 0;
        this.c = null;

        // add pass
        this.AddComponentPassIterator = 0;
        this.scope = this;

        // build pass
        this.buildPosition = {x:0, y:0};
        this.buildSize = {w:3, h:3};
        this.buildRenderer = {
            type: "DEFAULT",
            image: "DEFAULT_FILE.JPG",
            color: "#000000"
        };
        this.buildRigidbody = {
            velocity: {x:0, y:0},
            acceleration: {x:0, y:0},
            lastGrounded: false,
            grounded: false
        };
        this.buildTransformComponent = null;
        this.buildRendererComponent = null;
        this.buildRigidbodyComponent = null;
        this.buildReturnObject = {};

        this.addComponents( [transformComponent] );
    }

    _UpdateComponentPass(component){
        component.Update();
    }

    _GetComponentPass(component, name){
        if ( component.name == name ){
            this.c = component;
        }
    }

    _AddComponentPass(component, scope){
        component.game = scope.game;
        component.entity = scope;
        scope.components.push(component);
    }

    _OnCollisionEnterPass(component, collidingEntity){
        component.OnCollisionEnter(collidingEntity);
    }

    Update(){

        for ( this.UpdateComponentPassIterator=0; this.UpdateComponentPassIterator < this.components.length; this.UpdateComponentPassIterator++ ){
            this._UpdateComponentPass(this.components[this.UpdateComponentPassIterator]);
        }

        if(this.parentClient != null) {
            this.parentClient.Update();
        }
    }

    GetComponent(name){
        this.GetComponentPassIterator = 0;
        this.c = null;

        for ( this.GetComponentPassIterator=0; this.GetComponentPassIterator < this.components.length; this.GetComponentPassIterator++ ){
            this._GetComponentPass(this.components[this.GetComponentPassIterator], name);
        }

        return this.c;
    }

    addComponents(components){
        this.scope = this;

        for ( this.AddComponentPassIterator=0; this.AddComponentPassIterator < components.length; this.AddComponentPassIterator++ ){
            this._AddComponentPass(components[this.AddComponentPassIterator], this.scope);
        }
    }

    buildEntityLiteral(){

        this.buildReturnObject = {};

        // build Position data
        this.buildPosition.x = 0;
        this.buildPosition.y = 0;
        // build Size data
        this.buildSize.w = 3;
        this.buildSize.h = 3;
        // build Renderer data
        this.buildRenderer.type = "DEFAULT";
        this.buildRenderer.image = "DEFAULT_FILE.JPG";
        this.buildRenderer.color = "#000000";
        // build Rigidbody data
        this.buildRigidbody.velocity.x = 0;
        this.buildRigidbody.velocity.y = 0;
        this.buildRigidbody.acceleration.x = 0;
        this.buildRigidbody.acceleration.y = 0;
        this.buildRigidbody.lastGrounded = false;
        this.buildRigidbody.grounded = false;
        //build Component Objects
        this.buildTransformComponent = this.GetComponent("Transform");
        this.buildRendererComponent = this.GetComponent("Renderer");
        this.buildRigidbodyComponent = this.GetComponent("Rigidbody");

        if ( this.buildTransformComponent !== null ){
            this.buildPosition.x = this.buildTransformComponent.position.x;
            this.buildPosition.y = this.buildTransformComponent.position.y;
            this.buildSize.w = this.buildTransformComponent.size.w;
            this.buildSize.h = this.buildTransformComponent.size.h;
        }
        if ( this.buildRigidbodyComponent !== null ){
            this.buildRigidbody.velocity.x = this.buildRigidbodyComponent.velocity.x;
            this.buildRigidbody.velocity.y = this.buildRigidbodyComponent.velocity.y;
            this.buildRigidbody.acceleration.x = this.buildRigidbodyComponent.acceleration.x;
            this.buildRigidbody.acceleration.y = this.buildRigidbodyComponent.acceleration.y;
            this.buildRigidbody.lastGrounded = this.buildRigidbodyComponent.lastGrounded;
            this.buildRigidbody.grounded = this.buildRigidbodyComponent.grounded;
        }
        if ( this.buildRendererComponent !== null ){
            this.buildRenderer = this.buildRendererComponent.getLiteral();
        }

        //var componentsList = [];
        //this.components.forEach((c)=>{
        //   componentsList.push(c.name);
        //});

        this.buildReturnObject.name = this.name;
        this.buildReturnObject.position = this.buildPosition;
        this.buildReturnObject.size = this.buildSize;
        this.buildReturnObject.renderer = this.buildRenderer;
        this.buildReturnObject.rigidbody = this.buildRigidbody;

        return this.buildReturnObject;
    }

    OnCollisionEnter(collidingEntity){
        for ( this.UpdateComponentPassIterator=0; this.UpdateComponentPassIterator < this.components.length; this.UpdateComponentPassIterator++ ){
            this._OnCollisionEnterPass(this.components[this.UpdateComponentPassIterator], collidingEntity);
        }
    }

    getRect(){
        var rect = null,
            t = this.GetComponent("Transform");
        if ( t !== null ){
            rect = {
                x: t.position.x,
                y: t.position.y,
                w: t.size.w,
                h: t.size.h,
                ref: this
            };
        }
        return rect;
    }

}



// Physics.class.js ------------------------------


class Physics extends Revivable{

    constructor(options){
        super(options);
        this.name = "Physics";

        this.gravityEnabled = true;
        this.gravity = {x:0, y:75};

        //raycast options
        this.hit = false;
        this.point = {x:0, y:0};
        this.direction = {x:0, y:0};
        this.game = null;
        this.distance = 0;
        this.ray = { start:{x:0, y:0}, end:{x:0,y:0} };
        this.lines = [];
        this.entities = [];
    }

    Raycast(options){

        this.hit = false;
        this.point = options.point;
        this.direction = options.direction;
        this.game = options.game;
        this.distance = options.distance || 999999;

        // build this ray as a line
        this.ray.start.x = point.x;
        this.ray.start.y = point.y;
        this.ray.end.x = point.x + this.direction.x * this.distance;
        this.ray.end.y = point.y + this.direction.y * this.distance;

        // assuming lines are in the format
        // {start:_, end:_, Collider:_}
        // where A & B are points
        // Collider is a reference to the collider that owns the segment
        this.entities = [];

        // get all entities with colliders
        game.entities.forEach((entity)=>{
            var c = entity.GetComponent("Collider"),
                t = entity.GetComponent("Transform");
            if( c != null ){
                this.entities.push(t);
            }
        });

        // get all line segments that make up the box colliders
        this.entities.forEach((transform)=>{

            var p = transform.position,
                s = transform.size;

            /** the four points
             * A - - - B
             * |       |
             * |       |
             * |       |
             * C - - - D
             */
            var A={x:p.x, y:p.y},       B={x:p.x+s.w, y:p.y},
                C={x:p.x, y:p.y+s.h},   D={x:p.x+s.w, y:p.y+s.h};

            /**
             * the four exterior lines
             * A-B, B-D, C-D, A-C
             */

            var AB = {start:A, end:B, entity: transform.entity},
                BD = {start:B, end:D, entity: transform.entity},
                CD = {start:C, end:D, entity: transform.entity},
                AC = {start:A, end:C, entity: transform.entity};

            this.lines.push(AB, BD, CD, AC);
        });

        // check intersection against all the lines
        this.hit = this.lines.some((line)=>{
            if ( this.isIntersect(this.ray.start, this.ray.end, line.start, line.end) ){
                return this.verboseIntersect(this.ray, line);
            } else {
                return this.isIntersect(this.ray.start, this.ray.end, line.start, line.end);
            }
        });

        game.debug.push({
            type: "Raycast",
            ray: this.ray,
            result: this.hit
        });

        return this.hit;
    }

    isIntersect(p1, p2, p3, p4) {
        return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
    }

    verboseIntersect(ray, line){
        this.hit = {
                intersect: false,
                entity: null,
                collider: null,
                point: null  //{x:_, y:_}
            };
        var p1 = ray.start,
            p2 = ray.end,
            p3 = line.start,
            p4 = line.end;

        if ( this.isIntersect(p1, p2, p3, p4) ){

            var one = pointsToLineFormula(p1, p2),
                two = pointsToLineFormula(p3, p4),
                det = one.A*two.B - two.A*one.B;

            hit.intersect = true;

            if(det == 0){
                //Lines are parallel
            } else {
                var x = (two.B*one.C - one.B*two.C)/det,
                    y = (one.A*two.C - two.A*one.C)/det;

                hit.point = {x, y};
                hit.collider = line.entity.GetComponent("Collider");
                hit.entity = line.entity;
            }

        }

        return hit;
    }

}



//assuming points are in the format {x:_, y;_}
function CCW(p1, p2, p3){
    var a = p1.x, b = p1.y,
        c = p2.x, d = p2.y,
        e = p3.x, f = p3.y;
    return (f - b) * (c - a) > (d - b) * (e - a);
}

function pointsToLineFormula(p1, p2){
    var A = p2.y - p1.y,
        B = p2.x - p1.x,
        C = A*p1.x + B*p1.y;
    return {A, B, C};
}




// Quadtree.class.js ------------------------------

// http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374


class Quadtree extends Revivable {
    constructor(options){
        super(options);
        this.color = this.getRandomColor();

        this.maxObjects = 1;
        this.maxLevels = 20;

        this.level = options.level || 0;

        this.Objects = [];
        this.Bounds = options.bounds || {x:0,y:0,w:0,h:0};

        // array of Quadtrees
        this.nodes = [null, null, null, null];

    }

    /**
     * Clears the quadtree
     */
    clear() {
        // clear the quadtree
        this.Objects = [];

        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] != null) {
                this.nodes[i].clear();
                this.nodes[i] = null;
            }
        }
    }

    /**
     * Splits the node into 4 subnodes
     */
    split() {
        // split the node into four subnodes
        var subWidth = (this.Bounds.w / 2),
            subHeight = (this.Bounds.h / 2),
            x = this.Bounds.x,
            y = this.Bounds.y;

        this.nodes[0] = new Quadtree({
            level: this.level + 1,
            bounds: {
                x: x + subWidth,
                y: y,
                w: subWidth,
                h: subHeight
            }
        });
        this.nodes[1] = new Quadtree({
            level: this.level+1,
            bounds: {
                x: x,
                y: y,
                w: subWidth,
                h: subHeight
            }
        });
        this.nodes[2] = new Quadtree({
            level: this.level + 1,
            bounds: {
                x: x,
                y: y + subHeight,
                w: subWidth,
                h: subHeight
            }
        });
        this.nodes[3] = new Quadtree({
            level: this.level + 1,
            bounds: {
                x: x + subWidth,
                y: y + subHeight,
                w: subWidth,
                h: subHeight
            }
        });
    }

    /**
     * Determine which node the object belongs to. -1 means
     * object cannot completely fit within a child node and is part
     * of the parent node
     */
    getIndex(pRect) {
        var index = -1,
            verticalMidpoint = this.Bounds.x + (this.Bounds.w / 2),
            horizontalMidpoint = this.Bounds.y + (this.Bounds.h / 2),
            // Object can completely fit within the top quadrants
            topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.h < horizontalMidpoint),
            // Object can completely fit within the bottom quadrants
            bottomQuadrant = (pRect.y > horizontalMidpoint);

        if (pRect.x < verticalMidpoint && pRect.x + pRect.w < verticalMidpoint) { // Object can completely fit within the left quadrants
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        } else if (pRect.x > verticalMidpoint) { // Object can completely fit within the right quadrants
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }
        return index;
    }

    /**
     * Insert the object into the quadtree. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    insert(pRect) {

        //if ( !!pRect.ref ){
        //    pRect.ref.GetComponent("Renderer").color = this.color;
        //}

        if (this.nodes[0] != null) {
            var index = this.getIndex(pRect);
            if (index != -1) {
                this.nodes[index].insert(pRect);
                return;
            }
        }

        this.Objects.push(pRect);

        if (this.Objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (this.nodes[0] == null) {
                this.split();
            }

            var i = 0;
            while (i < this.Objects.length ){
                var index = this.getIndex(this.Objects[i]);
                if (index != -1) {
                    this.nodes[index].insert(this.Objects.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }
    }

    /**
     * Return all objects that could collide with the given object
     */
    retrieve(returnObjects, pRect) {
        var index = this.getIndex(pRect);
        if (index != -1 && this.nodes[0] != null) {
            returnObjects = returnObjects.concat(this.nodes[index].retrieve(returnObjects, pRect));
        }
        returnObjects = returnObjects.concat(this.Objects);
        return returnObjects;
    }

    // get all bounds
    getBounds (){
        var temp = [],
            b = this.Bounds;
        b.type = "Bounds";
        b.count = this.Objects.length;
        b.level = this.level;
        temp = temp.concat(b);
        this.nodes.forEach((node)=>{
            if ( node !== null ){
                temp = temp.concat(node.getBounds());
                //b.count += node.Objects.length;
            }
        });
        return temp;
    }

    // ==============
    getRandomColor() {
        var letters = '000ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 9)];
        }
        return color;
    }
}



// Renderer.class.js ------------------------------


class Renderer extends Component{
    constructor(options){
        super(options);
        this.name = "Renderer";
        this.type = options.rendererType || "Rectangle";
        this.source = "https://placeholdit.imgix.net/~text?txtsize=47&bg=ff0000&txtclr=ffffff&txt=ABCD&w=300&h=300";
        this.color = options.color || "#"+((1<<24)*Math.random()|0).toString(16);
    }

    getLiteral(){
        return {
            type: this.type,
            source: this.image,
            color: this.color
        };
    }
}



// Collider.class.js ------------------------------


class Collider extends Component{
    constructor(options){
        super(options);
        this.name = "Collider";

        /**
         * relative position of the collider to the Entity
         * 0,0 - is dead center
         * @type {{x: number, y: number}}
         */
        this.position = {x:0, y:0};

        /**
         * TODO:
         * Draw a debug outline for all colliders in the interface
         */
    }

    Update(){

    }
}



// Rigidbody.class.js ------------------------------


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



// Time.class.js ------------------------------


class Time extends Revivable {

    constructor(options) {
        super(options);
        this.options = options;
        this._currentFrameTime = new Date().getTime();
        this._lastFrameTime = new Date().getTime();
        this.step();
    }

    dt(){
        return (this._currentFrameTime - this._lastFrameTime) / 1000;
    };

    step(){
        this._lastFrameTime = this._currentFrameTime;
        this._currentFrameTime = new Date().getTime();
    }

    get deltaTime(){
        return this.dt();
    }

}



// Game.class.js ------------------------------


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



// Client.class.js ------------------------------


class Client extends Revivable{
    constructor(options){
        super(options);
        this.name = "Client";
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            mouseLeft: false,
            mouseRight: false,
            mouseMiddle: false,
            mouseX: 0,
            mouseY: 0
        };
        this.lastInput = {
            up: false,
            down: false,
            left: false,
            right: false,
            mouseLeft: false,
            mouseRight: false,
            mouseMiddle: false,
            mouseX: 0,
            mouseY: 0
        };
    }
    isFirstKeyPress(name) {
        return this.input[name] && this.input[name] != this.lastInput[name];
    }
    isKeyDown(name) {
        return this.input[name];
    }

    Update() {
        this.lastInput = this.input;
    }
}



// PhysicsEntity.class.js ------------------------------


class PhysicsEntity extends Entity {
    constructor(options){
        super(options);

        var kinematic = options.isKinematic || false,
            useGravity = options.useGravity || false,
            color = options.color || "#FFFFFF";

        var rendererComponent = new Renderer({
                rendererType: options.rendererType,
                color: color
            }),
            colliderComponent = new Collider({}),
            transformComponent = this.GetComponent("Transform");

        var rigidbodyComponent = new Rigidbody({transform: transformComponent, collider: colliderComponent});

        rigidbodyComponent.isKinematic = kinematic;
        rigidbodyComponent.useGravity = useGravity;

        this.addComponents([rendererComponent, colliderComponent, rigidbodyComponent]);
    }
}



// _CharacterMotion.class.js ------------------------------


/**
 * _CharacterMotion.class.js - BoxGame
 * This is a Custom Class specific to an implementation
 * not centric to the module.
 */

class CharacterMotion extends Component{
    constructor(options){
        super(options);
        this.name = "CharacterMotion";

        // references
        this.clientId = options.id;
        this.Transform = null;

        this.speed = 100;

        this.jumpForce = 175;
        this.jumpDuration = 200;
        this.jumping = false;
        this.jumpEndTime = 0;

        this.getKeyState = ()=>{
            return this.game.clients[this.clientId].input;
        };

        this.bottomCenter = null;
    }

    Update(){

        if ( new Date().getTime() >= this.jumpEndTime ){
            this.jumping = false;
        }

        var KeyState = this.getKeyState();

        if ( this.Transform == null ){
            this.Transform = this.entity.GetComponent("Transform");
        }

        if ( KeyState.up && this.entity.GetComponent("Rigidbody").grounded ){
            this.jumping = true;
            this.jumpEndTime = new Date().getTime() + this.jumpDuration;
        }

        if ( this.jumping ){
            this.entity.GetComponent("Rigidbody").velocity.y -= this.jumpForce;
        } else {
            this.entity.GetComponent("Rigidbody").acceleration.y = 0;
        }

        if ( KeyState.down ){

        }

        if ( KeyState.right ){
            this.entity.GetComponent("Rigidbody").acceleration.x = this.speed / 2 ;
        } else if ( KeyState.left ){
            this.entity.GetComponent("Rigidbody").acceleration.x = -this.speed / 2;
        } else {
            this.entity.GetComponent("Rigidbody").acceleration.x = 0;
        }

    }

}



// _DestroyAfterTime.class.js ------------------------------


class DestroyAfterTime extends Component{
    constructor(options){
        super(options);
        this.name = "DestroyAfterTime";
        this.startTime = Time._currentFrameTime;
    }

    Update(){
        if ( Time._currentFrameTime >= this.startTime + 5000  ){
            this.entity.garbage = true;
        }
    }

}



// _DestroyOnCollision.class.js ------------------------------


class DestroyOnCollision extends Component{
    constructor(options){
        super(options);
        this.name = "DestroyOnCollision";
    }

    Update(){

    }

    OnCollisionEnter(CollidingEntity){
        this.entity.garbage = true;
    }

}



// _Health.class.js ------------------------------


class Health extends Component{
    constructor(options){
        super(options);

        this.name = "Health";

        this.currentHealth = 0;
        this.maxHealth = 2;

        this.transformReference = null;

        this.characterSizes = [
            {w: 32, h:32}, // small
            {w: 32, h:64}, // medium
            {w: 64, h:72}  // large
        ];

        this.clientId = options.id;
    }

    Resize(){
        if ( this.transformReference != null ){
            this.transformReference.size = this.characterSizes[this.currentHealth];
        }
    }

    Update(){
        if ( this.transformReference == null ){
            this.transformReference = this.entity.GetComponent("Transform");
        }
        this.Resize();
    }

}



// _Shoot.class.js ------------------------------


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
                }),
                DOC = new DestroyOnCollision(),
                DAT = new DestroyAfterTime();

            bullet.addComponents([DOC, DAT]);
            bullet.GetComponent("Rigidbody").acceleration.x = (client.input.mouseX > (parentEntity.position.x + 16) ? 100 : -100);
            this.entity.game.addEntities([bullet]);
        }
    }

    // should know which client / character this is on
    // should know which way character is facing
    // should create bullet object and shoot it
}



