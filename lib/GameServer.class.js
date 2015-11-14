"use strict";

var Game = require('./Game.class.js');

// globals
var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

class GameServer extends Game {

    constructor(options) {
        super(options);
        this.clients = {};
    }

    onConnection(socket){
        console.log(socket.id + " - connection started");
        this.connectEvent(socket.id);

        socket.on('disconnect', () => {
            console.log("disconnected - " + socket.id);
            this.disconnectEvent(socket.id);
        });

        socket.on('keyStateChange', (keyStateObject)=>{
            this.keyStateChange(keyStateObject, socket);
        });
    }

    init(o){
        this.connectEvent = o.connect;
        this.disconnectEvent = o.disconnect;

        // set the server to listen on a port
        server.listen(o.port || 1337);

        // statically serve the client directory at root
        app.use('/', express.static('client'));

        io.on('connection', this.onConnection);

        // Broadcast Entity Literals for state
        setInterval(()=>{
            io.emit('update', {entities: this.getEntityLiterals()});
        }, 10);
    }

    keyStateChange(keyState, socket){
        // get client by id
        for(var key in this.clients){
            if (key.toString() == socket.id.toString()){
                this.clients[key].inputState.Input.Keys = keyState;
            }
        }
    }

}

module.exports = GameServer;