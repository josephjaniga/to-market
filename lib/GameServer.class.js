var Game = require('./Game.class.js');

// globals
var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);


class GameServer extends Game {
    constructor(options) {
        super(options);

        // set the server to listen on a port
        server.listen(options.port || 1337);

        // statically serve the client directory at root
        app.use('/', express.static('client'));

        io.on('connection', (socket) =>{
            console.log(socket.id + " - connection started");
            this.playerConnect(socket);

            socket.on('disconnect', function () {
                console.log("disconnected - " + socket.id);
                this.playerDisconnect(socket);
            });

            socket.on('keyStateChange', (keyStateObject)=>{
                this.keyStateChange(keyStateObject, socket);
            });

        });

        // Broadcast Entity Literals for state
        setInterval(()=>{
            io.emit('update', {entities: pig.getEntityLiterals()});
        }, 10);
    }
}

module.exports = GameServer;