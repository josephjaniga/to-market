var chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    assert = chai.assert,
    Renderer = require('./../lib/Renderer.class.js');

chai.should();

describe("Renderer", ()=>{

    it('should be an instance of a Renderer class', ()=>{
        var renderer = new Renderer({});
        expect(renderer).to.be.an.instanceOf(Renderer);
    });

    it('should have the name "Renderer"', ()=>{
        var renderer = new Renderer({});
        expect(renderer.name).to.equal("Renderer");
    });

    it('should have a Render Type Rectangle by default', ()=>{
        var renderer = new Renderer({});
        expect(renderer).to.have.property("type").to.be.equal("Rectangle");
    });

    it('should have a image source property', ()=>{
        var renderer = new Renderer({});
        expect(renderer).to.have.property("source");
    });

    it('should have a color property', ()=>{
        var renderer = new Renderer({});
        expect(renderer).to.have.property("color");
    });

});