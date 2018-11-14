const sinon = require('sinon');

let sendSms = sinon.stub().resolves();

let reserveAndGetChannel = function () {
    let instance = {
        'id': '123e4567-e89b-12d3-a456-426655440000',
        'status': 'FREE',
        'gw_reference': 'ABCD',
        'reservation': '123e4567-e89b-12d3-a456-426655440000',
        'sendSms': sendSms
    };


    return Promise.resolve(instance);
};

exports.reserveAndGetChannel = reserveAndGetChannel;
exports.sendSms = sendSms;
