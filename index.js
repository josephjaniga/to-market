"use strict";

// the core library stuff
var Client = require('./lib/Client.class.js'),
    Component = require('./lib/Component.class.js'),
    Entity = require('./lib/Entity.class.js'),
    Game = require('./lib/Game.class.js'),
    GameServer = require('./lib/GameServer.class.js'),
    InputState = require('./lib/InputState.class.js'),
    Renderer = require('./lib/Renderer.class.js'),
    Time = require('./lib/Time.class.js'),
    Transform = require('./lib/Transform.class.js');

var CharacterMotion = require('./lib/_CharacterMotion.class.js');

module.exports = {
    CharacterMotion,
    Client,
    Component,
    Entity,
    Game,
    GameServer,
    InputState,
    Renderer,
    Time,
    Transform
};