const rp = require('request-promise');
const config = require('../../config/env.config');
const log = require('../../common/services/log.service');

function reserveMessage(logger) {
    let reserveOptions = {
        method: 'GET',
        url: config.message_reservation.url,
        qs: {
            timeToRun: config.message_reservation.timeToRun
        },
        json: true
    };

    //logger.debug({reserveMessageOptions: reserveOptions}, 'reserveMessageOptions');

    return rp(reserveOptions)
        .then(function (res) {
            return Promise.resolve(res);
        }).catch(function (err) {
            if (err.error.httpStatusCode == 404) {
                return Promise.reject(new Error('No Messages to reserve'));
            }
            return Promise.reject(err);
        });
};

function deleteMessage(messageId) {
    let deleteOptions = {
        method: 'DELETE',
        url: config.message_delete.url.concat(messageId),
        resolveWithFullResponse: true,
        json: true
    };

    return rp(deleteOptions)
        .catch(function (err) {
            log.error({smsDatabaseDeliveredDeleteError: err}, 'smsDatabaseDeliveredDeleteError');
            return Promise.reject(err);
        });
};

function releaseMessage(messageId) {
    let releaseOptions = {
        method: 'PATCH',
        url: config.message_release.url.concat(messageId),
        resolveWithFullResponse: true,
        json: true,
        body: {
            status: 'ready',
            delay: 10
        }
    };

    log.debug({smsQueueReleaseOptions: releaseOptions}, 'smsQueueReleaseOptions');

    return rp(releaseOptions)
        .catch(function (err) {
        log.error({smsQueueReleaseError: err}, 'smsQueueReleaseError');
        return Promise.reject(err);
    });
};

function buryMessage(messageId, err) {
    let buryOptions = {
        method: 'PATCH',
        url: config.message_bury.url.concat(messageId),
        resolveWithFullResponse: true,
        json: {
            "status":"buried",
            "error": JSON.stringify(err)
        }
    };

    //log.debug({smsQueueBuryOptions: buryOptions}, 'smsQueueBuryOptions');

    return rp(buryOptions);
}

exports.reserveMessage = reserveMessage;
exports.deleteMessage = deleteMessage;
exports.releaseMessage = releaseMessage;
exports.buryMessage = buryMessage;