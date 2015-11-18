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

    it('should intersect perpendicular segments AB=(0,0)->(3,3) CD=(0,3)->(3,0)', ()=>{
        var P = new Physics({});
        var lineOne = {start: {x:0, y:0}, end: {x:3, y:3}},
            lineTwo = {start: {x:0, y:3}, end: {x:3, y:0}};
        var i = P.isIntersect(lineOne.start, lineOne.end, lineTwo.start, lineTwo.end);
        expect(i).to.be.true;
    });

    it('should not intersect parallel lines AB=(0,0)->(3,3) CD=(3,3)->(6,6)', ()=>{
        var P = new Physics({});
        var lineOne = {start: {x:0, y:0}, end: {x:3, y:3}},
            lineTwo = {start: {x:3, y:3}, end: {x:6, y:6}};
        var i = P.isIntersect(lineOne.start, lineOne.end, lineTwo.start, lineTwo.end);
        expect(i).to.be.false;
    });

});