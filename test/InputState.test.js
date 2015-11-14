var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    InputState = require('./../lib/InputState.class.js');

chai.should();

describe("InputState", ()=>{

    it('should be an instance of a InputState class', ()=>{
        var inputState = new InputState({});
        expect(inputState).to.be.an.instanceOf(InputState);
    });

    it('should have the name "InputState"', ()=>{
        var inputState = new InputState({});
        expect(inputState.name).to.equal("InputState");
    });

    it('should have an input object map', ()=>{
        var inputState = new InputState({});
        expect(inputState).to.have.property("Input").to.be.an('object');
    });

});