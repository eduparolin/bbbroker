require('../../tests/testFixtures').mockLog();

const sinon = require('sinon');
const expect = require('chai').expect;

const proxyquire = require('proxyquire');

const configRoute = require('../../tests/testConfigs').success.route;
const successMessage = require('../../tests/testConfigs').success.message;

const ChannelMock = require('../channel/Channel.mock');

const Route = proxyquire('./Route', {
    '../channel/Channel': ChannelMock
});

xdescribe('Route Send SMS', function () {

    let route;

    before('Create database test elements', async () => {
        return route = await Route.create({
            name: configRoute.name,
            prefix: configRoute.prefix
        });
    });

    xit('Should Send SMS', async () => {
        let destinationNumber = successMessage.destination;
        let text = successMessage.text;
        let route = await Route.getRouteByPrefix(configRoute.prefix);
        ChannelMock.reserveAndGetChannel = sinon.spy(ChannelMock.reserveAndGetChannel);
        await route.sendSms('op', destinationNumber, text);

        expect(ChannelMock.reserveAndGetChannel).to.have.been.calledWith(configRoute.prefix, 'op');

        return expect(ChannelMock.sendSms).to.have.been.calledWith(destinationNumber, text);
    });

    after('Cleanup', () => {
        return route.destroy();
    });

});

xdescribe('Route does not exist', function () {
    it('Should Fail to get route', () => {
        return expect(Route.getRouteByPrefix('asdsaddsa')).to.eventually.be.rejectedWith('Route not found');
    });
});
