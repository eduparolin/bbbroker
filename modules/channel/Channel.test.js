require('../../tests/testFixtures').mockLog();

const sinon = require('sinon');
const expect = require('chai').expect;

const proxyquire = require('proxyquire');

const configChannel = require('../../tests/testConfigs').success.channel;
const configChip = require('../../tests/testConfigs').success.chip;
const configRoute = require('../../tests/testConfigs').success.route;
const configGateway = require('../../tests/testConfigs').success.gateway;
const successMessage = require('../../tests/testConfigs').success.message;

require('../database/database.service');

const FreeswitchMock = require('../freeswicth/FreeSwitch.mock');
const Gateway = proxyquire('../gateways/Gateway', {
    '../freeswicth/FreeSwitch': FreeswitchMock
});
const Channel = require('./Channel');
const Chip = require('../chips/Chip');
const Route = require('../routes/Route');

xdescribe('Channel Send SMS', function () {

    let channel;
    let chip;
    let route;
    let gateway;

    before('Create database test elements', () => {
        if (configChip && configChip[0]) {
            return Chip.create(configChip[0])
                .then((chipEntity) => {
                    return chip = chipEntity;
                }).then(() => {
                    return Route.create(
                        {
                            name: configRoute.name,
                            prefix: configRoute.prefix
                        })
                        .then((routeEntity) => {
                            route = routeEntity;
                            return routeEntity.setChips(chip);
                        });
                }).then(() => {
                    return Gateway.create({
                        ip: configGateway.host,
                        type: configGateway.type
                    });
                }).then((gatewayEntity) => {
                    gateway = gatewayEntity;
                    return Channel.create({
                            status: configChannel.status,
                            gw_reference: configChannel.gw_reference,
                            gateway_id: gateway.id
                        })
                        .then((channelEntity) => {
                            channel = channelEntity;
                            return chip.update({
                                channel_id: channelEntity.id
                            })
                        });
                });
        }
    });

    it('Should Send SMS', async () => {
        let destinationNumber = successMessage.destination;
        let text = successMessage.text;
        let channel = await Channel.reserveAndGetChannel(configRoute.prefix, configRoute.operator);
        let spyFree = sinon.spy(channel.free);
        channel.free = spyFree;
        await channel.sendSms(destinationNumber, text, {}, 'OI');

        expect(FreeswitchMock.sendSms).to.have.been.calledWith(configGateway.host, configChannel.gw_reference, destinationNumber, text);

        return expect(spyFree.called).to.be.true;
    });

    after('Cleanup', async () => {
        await chip.destroy();
        await channel.destroy();
        await gateway.destroy();
        await route.destroy();
    });

});

xdescribe('Should reject', function () {
    it('Should Throw Could not reserve channel', async () => {
        return expect(Channel.reserveAndGetChannel('wrongRoute',
            configRoute.operator)).to.eventually.be.rejectedWith('Could not reserve channel');
    });
});
