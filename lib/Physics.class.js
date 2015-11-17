"use strict";

//assuming points are in the format {x:_, y;_}

function CCW(p1, p2, p3){
    var a = p1.x, b = p1.y,
        c = p2.x, d = p2.y,
        e = p3.x, f = p3.y;
    return (f - b) * (c - a) > (d - b) * (e - a);
}

function isIntersect(p1, p2, p3, p4) {
    return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
}

class Physics{

    constructor(options){
        this.name = "Physics";

        this.gravityEnabled = true;
        this.gravity = {x:0, y:75};
    }

    Raycast(options){
        var hit = false,
            point = options.point,
            direction = options.direction,
            game = options.game,
            ray = {},
            lines = [];

        // build this ray as a line
        ray = {
            a: {
                x:point.x,
                y:point.y
            },
            b: {
                x:point.x + direction.x * 9999,
                y:point.y + direction.y * 9999
            }
        };

        // assuming lines are in the format
        // {a:_, b:_, Collider:_}
        // where A & B are points
        // Collider is a reference to the collider that owns the segment

        // get all entities with colliders

        // get all line segments that make up the box colliders

        // check intersection against all the lines

        lines.forEach((line)=>{

        });

        return hit;
    }


}

module.exports = Physics;