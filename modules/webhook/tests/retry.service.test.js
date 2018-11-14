const proxyquire = require('proxyquire');
const retryService = proxyquire('../services/retry.service',
    {'../services/webhook.service': {
            sendSMS: function () {
                return Promise.resolve('aaaaaa');
            }
        }});

describe('Test Retry Service', () => {
    it('retrySuccess', (done) => {
        retryService.retrySms()
            .then((res) => {
                console.log(res);
                done();
            })
    })
});
