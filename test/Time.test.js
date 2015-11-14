var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Time = require('./../lib/Time.class.js');

chai.should();

describe("Time", ()=>{

    it('should be an instance of a Time class', ()=>{
        var time = new Time({});
        expect(time).to.be.an.instanceOf(Time);
    });

    it('should have a _lastFrameTime property', ()=>{
        var time = new Time({});
        expect(time).to.have.property("_lastFrameTime").to.be.a('number');
    });

    it('should be able to access deltaTime getter and receive a number', ()=>{
        var time = new Time({});
        expect(time.deltaTime).to.be.a('number');
    });

});