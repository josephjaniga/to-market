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

    it('should have a useGravity flag set to truet', ()=>{
        var rigidbody = new Rigidbody({});
        expect(rigidbody).to.have.property("useGravity").to.be.true;
    });

});