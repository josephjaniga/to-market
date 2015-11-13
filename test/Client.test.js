var chai = require('chai'),
    expect = chai.expect,
    Client = require('./../lib/Client.class.js');

chai.should();

describe("Client", ()=>{
    var clientInstance = new Client({id: "Some Fake Id"});

    it('should have the approriate component name "Client"', ()=>{
        clientInstance.name.should.equal('Client');
    });
});