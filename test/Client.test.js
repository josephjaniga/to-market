var chai = require('chai'),
    expect = chai.expect,
    Client = require('./../lib/Client.class.js');

chai.should();

describe("Client", ()=>{
    var clientInstance = new Client({id: "Some Fake Id"});

    it('should have name "Client"', ()=>{
        clientInstance.name.should.equal('Client');
    });

    it('should be an instance of a Client class', ()=>{
        expect(clientInstance).to.be.an.instanceOf(Client);
    });

    it('should have an InputState member', ()=>{
        expect(clientInstance.inputState).to.be.an.instanceof(InputState);
    });
});