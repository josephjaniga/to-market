var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Transform = require('./../lib/Transform.class.js');

chai.should();

describe("Transform", ()=>{

    it('should be an instance of a Transform class', ()=>{
        var transform = new Transform({});
        expect(transform).to.be.an.instanceOf(Transform);
    });

    it('should have the name "Transform"', ()=>{
        var transform = new Transform({});
        expect(transform).to.have.property("name").to.equal("Transform");
    });

    it('should have a position object member', ()=>{
        var transform = new Transform({});
        expect(transform).to.have.property("position").to.be.an('object');
    });

    it('should have a size object member', ()=>{
        var transform = new Transform({});
        expect(transform).to.have.property("size").to.be.an('object');
    });

});