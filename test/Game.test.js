var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Game = require('./../lib/Game.class.js'),
    Physics = require('./../lib/Physics.class.js'),
    Time = require('./../lib/Time.class.js');

chai.should();

describe("Game", ()=>{

    it('should be an instance of a Game class', ()=>{
        var game = new Game({});
        expect(game).to.be.an.instanceOf(Game);
    });

    it('should have an thisFrameTime microtime property', ()=>{
        var game = new Game({});
        expect(game).to.have.property('thisFrameTime').to.be.an('number');
    });

    it('should have an lastFrameTime microtime property', ()=>{
        var game = new Game({});
        expect(game).to.have.property('lastFrameTime').to.be.an('number');
    });

    it('should have an empty Entities List member', ()=>{
        var game = new Game({});
        expect(game).to.have.property('entities').to.have.length(0);
    });

    it('should have Time property', ()=>{
        var game = new Game({});
        expect(game).to.have.property('Time').to.be.an.instanceOf(Time);
    });

    it('should have Physics property', ()=>{
        var game = new Game({});
        expect(game).to.have.property('Physics').to.be.an.instanceOf(Physics);
    });

    it('update method should call Update of all its child components', ()=>{
        // spy to watch
        var updateSpy = sinon.spy(),
            spyEntity = {name: "SpyEntity", Update: updateSpy};
        var game = new Game();
        game.addEntities([spyEntity]);
        game.Update(game);
        updateSpy.called.should.be.true;
    });

    it('update method should call Time.step()', ()=>{
        // spy to watch
        var updateSpy = sinon.spy(),
            TimeSpy = {name: "SpyEntity", step: updateSpy};
        var game = new Game();
        game.Time = TimeSpy;
        game.Update(game);
        updateSpy.called.should.be.true;
    });

    it('getEntityByName accurately returns existing entity', ()=>{
        var needleEntity = {name: "Needle"},
            game = new Game();
        game.addEntities([needleEntity]);
        var result = game.getEntityByName("Needle");
        expect(result).to.equal(needleEntity);
    });

    it('GetComponent accurately returns null for not found components', ()=>{
        var game = new Game();
        var result = game.getEntityByName("Robotron");
        expect(result).to.be.null;
    });


});