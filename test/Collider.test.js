var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    Collider = require('./../lib/Collider.class.js');

chai.should();

describe("Collider", ()=>{
    var colliderInstance = new Collider();

    it('should have name "Collider"', ()=>{
        colliderInstance.name.should.equal('Collider');
    });

    it('should be an instance of a Collider', ()=>{
        expect(colliderInstance).to.be.an.instanceOf(Collider);
    });

    it('should have a position member object with X & Y coords', ()=>{
        assert.typeOf(colliderInstance.position, 'object');
        expect(colliderInstance.position).to.have.property('x');
        expect(colliderInstance.position).to.have.property('y');
    });
});