const gateway = require('../../tests/testConfigs').success.gateway;
const failGateway = require('../../tests/testConfigs').fail.gateway;
const message = require('../../tests/testConfigs').success.message;
const failMessage = require('../../tests/testConfigs').fail.message;

require('../../tests/testFixtures').mockLog();

const FreeSwitch = require('./FreeSwitch');

describe('FreeSwitch Class', function () {
    this.timeout(10000);
    it('Should send an sms message', function (done) {
        FreeSwitch.sendSms(gateway.host, gateway.channel, message.destination, message.text)
            .then(() => {
                done();
            }, (error) => {
                done(new Error(error));
            });
    });
    it('Should not send an sms message - ip not found', function (done) {
        this.timeout(60000);
        FreeSwitch.sendSms(failGateway.host, gateway.channel, message.destination, message.text)
            .then(() => {
                done('Should have rejected');
            }, () => {
                done();
            });
    });
    it('Should not send an sms message - channel not found', function (done) {
        this.timeout(60000);
        FreeSwitch.sendSms(gateway.host, failGateway.channel, message.destination, message.text)
            .then(() => {
                done('Should have rejected');
            }, () => {
                done();
            });
    });

    it('Should not send an sms message - Number not found', function (done) {
        FreeSwitch.sendSms(gateway.host, gateway.channel, failMessage.destination, message.text)
            .then(() => {
                done('Should have rejected');
            }, () => {
                done();
            });
    });

    it('Should list freeswitch channels', function (done) {
        FreeSwitch.listChannels(gateway.host)
            .then(() => {
                done();
            }, (error) => {
                done(error);
            });
    });

    it('Should not list freeswitch channels - ip not found', function (done) {
        this.timeout(60000);
        FreeSwitch.listChannels(failGateway.host)
            .then(() => {
                done('Should have rejected');
            }, () => {
                done();
            });
    });
});
