"use strict";

var Game = require('./Game.class.js');
var Entity = require('./Entity.class.js');

// globals
var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

class GameServer extends Game {
    constructor(options) {
        super(options);

        this.Entity = Entity;

        this.keyStateChange = (keyState, socket)=>{
            //var playerString = this.getNameOfPlayerById(socket.id);
            //if ( playerString !== null ){
            //    this.entities[playerString].keyIsPressed = keyState;
            //}
        };

        this.init = (o)=>{
            this.connectEvent = o.connect;
            this.disconnectEvent = o.disconnect;

            // set the server to listen on a port
            server.listen(o.port || 1337);

            // statically serve the client directory at root
            app.use('/', express.static('client'));

            io.on('connection', (socket) =>{
                console.log(socket.id + " - connection started");
                this.connectEvent(socket.id);

                socket.on('disconnect', () => {
                    console.log("disconnected - " + socket.id);
                    this.disconnectEvent(socket.id);
                });

                socket.on('keyStateChange', (keyStateObject)=>{
                    this.keyStateChange(keyStateObject, socket);
                });

            });

            // Broadcast Entity Literals for state
            setInterval(()=>{
                io.emit('update', {entities: this.getEntityLiterals()});
            }, 10);
        };

    }
}

module.exports = GameServer;