"use strict";

var Collider = require('./Collider.class.js'),
    Entity = require('./Entity.class.js'),
    Renderer = require('./Renderer.class.js'),
    Rigidbody = require('./Rigidbody.class.js'),
    Transform = require('./Transform.class.js');

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

module.exports = PhysicsEntity;