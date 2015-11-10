"use strict";

var GameServer = require('./lib/GameServer.class.js');

module.exports = (options)=>{
    return new GameServer({
        port: process.env.PORT,
        connect: options.connect,
        disconnect: options.disconnect
    });
};