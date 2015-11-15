var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Game = require('./../lib/Game.class.js'),
    GameServer = require('./../lib/GameServer.class.js');

chai.should();

describe("GameServer", ()=>{

    it('should be an instance of a GameServer class', ()=>{
        var gameServer = new GameServer({});
        expect(gameServer).to.be.an.instanceOf(GameServer);
    });

    it('should have a clients connection object', ()=>{
        var gameServer = new GameServer({});
        expect(gameServer).to.have.property('clients').to.be.an('object');
    });

    xit('onConnection should call connection event and socket on x2', ()=>{
        var onSpy = sinon.spy(),
            cSpy = sinon.spy(),
            socketMock = {on: onSpy},
            gameServer = new GameServer({});

        gameServer.init({connect:cSpy, disconnect:()=>{}});

        gameServer.onConnection(socketMock);

        cSpy.should.have.been.calledOnce;
        onSpy.should.have.been.calledTwice;
    });

    it('init should setup connection and disconection events', ()=>{
        var gameServer = new GameServer({});
        expect(gameServer).not.to.have.property('connectEvent');
        expect(gameServer).not.to.have.property('disconnectEvent');
        gameServer.init({
            connect: "C",
            disconnect: "D"
        });
        expect(gameServer).to.have.property('connectEvent').to.equal("C");
        expect(gameServer).to.have.property('disconnectEvent').to.equal("D");
    });

    it('keyStateChange should update the client object key states', ()=>{
        var gameServer = new GameServer({});
        expect(gameServer).to.have.property('clients').to.be.empty;
        gameServer.clients["1234"] = {
            id: "1234",
            inputState: {
                Input:{
                    Keys:false
                }
            }
        };
        expect(gameServer.clients).have.property("1234");
        expect(gameServer.clients["1234"].inputState.Input.Keys).to.be.false;

        gameServer.keyStateChange(true, {id:"1234"});
        expect(gameServer).to.have.property('clients').to.not.be.empty;
        expect(gameServer.clients).have.property("1234");
        expect(gameServer.clients["1234"].inputState.Input.Keys).to.be.true;
    });

});