"use strict";

// http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

class Quadtree {
    constructor(options){

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

module.exports = Quadtree;