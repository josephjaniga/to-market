var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    Component = require('./../lib/Component.class.js');

chai.should();

describe("Component", ()=>{

    it('should have name "Component"', ()=>{
        var componentInstance = new Component();
        componentInstance.name.should.equal('Component');
    });

    it('should be an instance of a Component', ()=>{
        var componentInstance = new Component();
        expect(componentInstance).to.be.an.instanceOf(Component);
    });

    it('should assign Parent entity reference', ()=>{
        var e = {game:"1234"};
        var componentInstance = new Component({entity: e});
        expect(componentInstance).to.have.property("entity").to.equal(e);
    });

    it('should assign game reference from the parent entity', ()=>{
        var componentInstance = new Component({entity: {game:"1234"}});
        expect(componentInstance).to.have.property("game").to.equal("1234");
    });

});