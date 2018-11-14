const successGateway = require('../../tests/testConfigs').success.gateway;
const successMessage = require('../../tests/testConfigs').success.message;
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

require('../../tests/testFixtures').mockLog();

const FreeSwitchMock = require('../freeswicth/FreeSwitch.mock');

const Gateway = proxyquire('./Gateway', {
    '../freeswicth/FreeSwitch': FreeSwitchMock
});

xdescribe('Gateway Send SMS', function () {
    let gateway;

    before('Create a valid Gateway', async () => {
        return gateway = await Gateway.create({
            id: successGateway.id,
            ip: successGateway.host,
            type: successGateway.type
        });
    });

    it('Should Send SMS', async () => {
        let destinationNumber = successMessage.destination;
        let text = successMessage.text;
        let ip = successGateway.host;
        let channel = successGateway.channel;
        let gat = await Gateway.getGatewayById(successGateway.id);
        await gat.sendSms(channel, destinationNumber, text);

        return expect(FreeSwitchMock.sendSms).to.have.been.calledWith(ip, channel, destinationNumber, text);
    });

    after('Cleanup', () => {
        gateway.destroy();
    });
});

xdescribe('Gateway does not exist', function () {
    it('Should Fail to get gateway', () => {
        return expect(Gateway.getGatewayById('asdsaddsa')).to.eventually.be.rejectedWith('Gateway not found');
    });
});
