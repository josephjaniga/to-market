"use strict";

var GameServer = require('./lib/GameServer.class.js');

module.exports = (()=>{
    return new GameServer({port: process.env.PORT});
})();