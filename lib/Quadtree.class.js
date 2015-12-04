"use strict";

// http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

class Quadtree {
    constructor(options){

        this.maxObjects = 10;
        this.maxLevels = 5;

        this.level = options.level || 0;

        this.Objects = [];
        this.Bounds = options.bounds || {x:0,y:0,w:0,h:0};

        // array of Quadtrees
        this.nodes = [];

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
    }

    /**
     * Determine which node the object belongs to. -1 means
     * object cannot completely fit within a child node and is part
     * of the parent node
     */
    getIndex() {

    }

    /**
     * Insert the object into the quadtree. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    insert() {

    }

    /**
     * Return all objects that could collide with the given object
     */
    retreive() {

    }
}

module.exports = Quadtree;