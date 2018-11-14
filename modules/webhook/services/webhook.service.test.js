require('../../../tests/testFixtures');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const webhook = proxyquire('./webhook.service', {
    '../../sms/Sms': {
        increaseWebhookAttempt: function () {
            return Promise.resolve()
        },
        createSms: function(){
            return Promise.resolve({increaseWebhookAttempt(){}})
        }
    },
    '../../chips/Chip': {
        getRouteByChipNumber: function () {
            return {
                number: 'test',
                route: {
                    webhook_recv: 'test',
                    webhook_dlr: 'test'
                }
            }
        },
        setDelivered: function () {
            return Promise.resolve()
        }
    },
    'request-promise':
        function () {
            return Promise.resolve()
        }

});


const webhookFail = proxyquire('./webhook.service', {
    '../../sms/Sms': {
        increaseWebhookAttempt: function () {
            return Promise.resolve()
        },
        createSms: function(){
            return Promise.resolve({increaseWebhookAttempt(){}})
        }
    },
    '../../chips/Chip': {
        getRouteByChipNumber: function () {
            return {
                number: 'test',
                route: {
                    webhook_recv: 'test',
                    webhook_dlr: 'test'
                }
            }
        },
        setDelivered: function () {
            return Promise.resolve()
        }
    },
    'request-promise':
        function () {
            return Promise.reject()
        }

});

describe(' Webhook Service Test', function () {
    it('sendWebhookSMS - recv', async () => {
        let res = await webhook.sendWebhookSMS('test', '5541998451489', 'recv', '5541998451489');
        return expect(res).to.be.undefined;
    });
    it('sendWebhookSMS - dlr', async () => {
        let res = await webhook.sendWebhookSMS('test', '5541998451489', 'dlr', '5541998451489');
        return expect(res).to.be.undefined;
    });
    it('sendWebhookSMSFail - dlr', async () => {
        let res = await webhookFail.sendWebhookSMS('test', '5541998451489', 'dlr', '5541998451489');
        return expect(res).to.be.undefined;
    });
});
