require('./testFixtures').mockLog();

const configChips = require('./testConfigs').success.chip;
const configChannel = require('./testConfigs').success.channel;
const configRoute = require('./testConfigs').success.route;
const successGateway = require('./testConfigs').success.gateway;
const successMessage = require('./testConfigs').success.message;

require('mock-require')('../freeswicth/FreeSwitch', require('../modules/freeswicth/FreeSwitch.mock'));
require('../modules/database/database.service');

const Chip = require('../modules/chips/Chip');
const Channel = require('../modules/channel/Channel');
const Route = require('../modules/routes/Route');
const Gateway = require('../modules/gateways/Gateway');

describe('Send SMS E2E', function () {
    let chips = [];
    let route;
    let channels = [];
    let gateway;

    before('Create database test elements', done => {
        let chipPromises = [];
        for (let chip of configChips) {
            chipPromises.push(Chip.create(chip).then((chipEntity) => {
                chips.push(chipEntity);
            }));
        }
        Promise.all(chipPromises).then(() => {
            return Route.create(
                {
                    name: configRoute.name,
                    prefix: configRoute.prefix
                })
                .then((routeEntity) => {
                    route = routeEntity;
                    return routeEntity.setChips(chips);
                });
        }).then(() => {
            return Gateway.create({
                ip: successGateway.host,
                type: successGateway.type
            });
        }).then((gatewayEntity) => {
            gateway = gatewayEntity;
            let channelsPromises = [];
            for (let chipIndex in chips) {
                let promise = Channel.create({
                    status: configChannel.status,
                    gw_reference: configChannel.gw_reference + chipIndex,
                    gateway_id: gateway.id
                })
                    .then((channelEntity) => {
                        channels.push(channelEntity);
                        return channelEntity.setChips([chips[chipIndex]]);
                    });
                channelsPromises.push(promise);
            }
            return Promise.all(channelsPromises);
        }).then(() => {
            done();
        });
    });

    it('Should Send SMS', async () => {
        let destinationNumber = successMessage.destination;
        let text = successMessage.text;
        let route = await Route.getRouteByPrefix(configRoute.prefix);
        return route.sendSms(destinationNumber, text);
    });

    after('Cleanup', () => {
        let chipPromises = [];
        for (let chip of chips) {
            chipPromises.push(chip.destroy());
        }
        return Promise.all(chipPromises)
            .then(() => {
                return route.destroy();
            })
            .then(() => {
                let channelPromises = [];
                for (let channel of channels) {
                    channelPromises.push(channel.destroy());
                }
                return Promise.all(channelPromises);
            })
            .then(() => {
                gateway.destroy();
            });
    });
});
