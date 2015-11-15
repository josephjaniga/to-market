var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Entity = require('./../lib/Entity.class.js'),
    Transform = require('./../lib/Transform.class.js');

chai.should();

describe("Entity", ()=>{

    it('should have name "Entity"', ()=>{
        var entity = new Entity({});
        entity.name.should.equal('Entity');
    });

    it('should be an instance of a Entity class', ()=>{
        var entity = new Entity({});
        expect(entity).to.be.an.instanceOf(Entity);
    });

    it('should have a Garbage flag member', ()=>{
        var entity = new Entity({});
        expect(entity.garbage).to.equal(false);
    });

    it('should have a member list of components', ()=>{
        var entity = new Entity({});
        assert.typeOf(entity.components, 'array');
    });

    it('should have a Game Reference member', ()=>{
        var entity = new Entity({game: "Game"});
        expect(entity).to.have.property('game');
    });

    it('constructor should populate components', ()=>{
        var options = {
                game: "Game",
                components: [{name: "FakeComponentInjection"}]
            };
        var entity = new Entity(options);
        // Length 2 - new Fake Component & Default Transform
        expect(entity).to.have.property('components').with.length(2);
    });

    it('update method should call Update of all its child components', ()=>{
        // spy to watch
        var updateSpy = sinon.spy(),
            spyComponent = {name: "SpyComponent", Update: updateSpy};
        var options = {game: "Game", components:[spyComponent]};
        var entity = new Entity(options);
        entity.Update();
        updateSpy.called.should.be.true;
    });

    it('GetComponent accurately returns existing component', ()=>{
        var needleComponent = {name: "Needle"},
            options = {game: "Game", components:[needleComponent]},
            entity = new Entity(options),
            result = entity.GetComponent("Needle");
        expect(result).to.equal(needleComponent);
    });

    it('GetComponent accurately returns null for not found components', ()=>{
        var options = {game: "Game", components:[]},
            entity = new Entity(options),
            result = entity.GetComponent("Sassafrass");
        expect(result).to.be.null;
    });

    it('addComponents should be called once without passing components', ()=>{
        var addComponentsSpy = sinon.spy();
            Entity.prototype.addComponents = addComponentsSpy;
        var entity = new Entity({});
        addComponentsSpy.called.should.be.true;
    });

});