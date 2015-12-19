"use strict";

var Revivable = require('./Revivable.class.js');

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

module.exports = Physics;


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

