"use strict";

// the core library stuff
var Client = require('./lib/Client.class.js'),
    Collider = require('./lib/Collider.class.js'),
    Component = require('./lib/Component.class.js'),
    Entity = require('./lib/Entity.class.js'),
    Game = require('./lib/Game.class.js'),
    GameServer = require('./lib/GameServer.class.js'),
    InputState = require('./lib/InputState.class.js'),
    Physics = require('./lib/Physics.class.js'),
    Renderer = require('./lib/Renderer.class.js'),
    Rigidbody = require('./lib/Rigidbody.class.js'),
    Time = require('./lib/Time.class.js'),
    Transform = require('./lib/Transform.class.js');

// user implemented classes? this should go in the implementation of the game
// these will be specific to each individual game but probably do not belong in a library
var CharacterMotion = require('./lib/_CharacterMotion.class.js');

module.exports = {
    CharacterMotion,
    Client,
    Collider,
    Component,
    Entity,
    Game,
    GameServer,
    InputState,
    Physics,
    Renderer,
    Rigidbody,
    Time,
    Transform
};