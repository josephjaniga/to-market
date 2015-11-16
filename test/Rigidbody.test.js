var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Rigidbody = require('./../lib/Rigidbody.class.js');

chai.should();

describe("Rigidbody", ()=>{

    it('should be an instance of a Rigidbody class', ()=>{
        var rigidbody = new Rigidbody({});
        expect(rigidbody).to.be.an.instanceOf(Rigidbody);
    });

    it('should have the name "Rigidbody"', ()=>{
        var rigidbody = new Rigidbody({});
        expect(rigidbody.name).to.equal("Rigidbody");
    });

    it('should have a isKinematic flag set to false', ()=>{
        var rigidbody = new Rigidbody({});
        expect(rigidbody).to.have.property("isKinematic").to.be.false;
    });

    it('should have a useGravity flag set to true', ()=>{
        var rigidbody = new Rigidbody({});
        expect(rigidbody).to.have.property("useGravity").to.be.true;
    });

    it('AABB should detect collision', ()=>{
        var rigidbody = new Rigidbody({}),
            rectA = {x: 0, y:0, w:10, h:10},
            rectB = {x: 2, y:2, w:10, h:10},
            rectC = {x: 11, y:11, w:10, h:10};
        expect(rigidbody.AABB(rectA,rectB)).to.be.true;
        expect(rigidbody.AABB(rectA,rectC)).to.be.false;
    });

});