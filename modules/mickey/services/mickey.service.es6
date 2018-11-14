const request = require('request-promise');
const config = require('../../config/env.config');

function setDelivered(smsId, receivedAt = new Date(), logger) {

    let options = {
        method: 'PATCH',
        url: `${config.mickey.url}${smsId}`,
        body: {status: 'RECEIVED', brokerReceivedAt: receivedAt},
        json: true
    };

    logger.debug({setDeliveredRequest: options}, 'setDelivered request');
    return request(options).then((response) => {
        logger.debug({setDeliveredResponse: response}, 'setDelivered response');
        return response;
    }).catch((err) => {
        logger.error({setDeliveredError: err}, 'setDelivered error');
        return Promise.reject(err);
    }).error((err) => {
        logger.error({setDeliveredUndefinedError: err}, 'setDelivered undefined error');
        return Promise.reject(err);
    });
}

exports.setDelivered = setDelivered;