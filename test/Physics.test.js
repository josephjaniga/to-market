var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Physics = require('./../lib/Physics.class.js');

chai.should();

describe("Physics", ()=>{

    it('should be an instance of a Physics class', ()=>{
        var physics = new Physics({});
        expect(physics).to.be.an.instanceOf(Physics);
    });

    it('should have the name "Physics"', ()=>{
        var physics = new Physics({});
        expect(physics.name).to.equal("Physics");
    });

    it('should have an gravity object enabled', ()=>{
        var physics = new Physics({});
        expect(physics).to.have.property("gravityEnabled").to.be.true;
    });

    it('should have an gravity value set to 10', ()=>{
        var physics = new Physics({});
        expect(physics).to.have.property("gravity").to.be.an('object');
        expect(physics.gravity).to.have.property('x');
        expect(physics.gravity).to.have.property('y');
    });

});