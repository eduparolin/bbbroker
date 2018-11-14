const consumer = require('./services/consumer.service');
const dao = require('./consumer.daos/consumer.dao');
const log = require('../common/services/log.service');

async function updateMessages() {
    try {
        let message = await consumer.reserveMessage(log);
        if (message.reservationCounter >= 10) {
            return stopReservation(message, 'Reservation limit exceeded (10 times)');
        }
        if (message.tag === 'SENT') {
            log.debug({smsDatabaseSentReceived: message}, 'smsDatabaseSentReceived');
            return setMessageSent(message);
        }
        log.debug({smsDatabaseDeliveredReceived: message}, 'smsDatabaseDeliveredReceived');
        return setMessageDelivered(message);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function setMessageSent(message) {
    let messagePayload = JSON.parse(message.payload);
    if (messagePayload.ID_MO_MOES) {
        try {
            await dao.updateMessageStatus(message.tag, messagePayload, log);
            await consumer.deleteMessage(message.id);
            return Promise.resolve();
        } catch (err) {
            log.error({smsDatabaseSentDeleteError: err}, 'smsDatabaseSentDeleteError');
            return Promise.reject(err);
        }
    } else {
        try {
            await consumer.deleteMessage(message.id);
        } catch (e) {
            log.error({smsDatabaseSentWOIDDeleteError: e}, 'smsDatabaseSentWOIDDeleteError');
            return Promise.reject(e);
        }
        return Promise.resolve();
    }
}

async function setMessageDelivered(message) {
    let messagePayload = JSON.parse(message.payload);

    return dao.updateMessageStatusByProvider(message.tag, messagePayload, messagePayload.id, log)
        .then((response) => {
            if (response.affectedRows) {
                return consumer.deleteMessage(message.id);
            } else {
                return consumer.releaseMessage(message.id);
            }
        }).catch((err) => {
            return stopReservation(message, err);
        });
}

function stopReservation(message, error) {
    return consumer.buryMessage(message.id, error)
        .then(function (response) {
            log.debug({smsReservationBuryResponse: response}, 'smsReservationBuryResponse');
            return Promise.resolve();
        }).catch(function (err) {
            log.error({smsReservationBuryError: err}, 'smsReservationBuryError');
            return Promise.reject(err);
        });
}

exports.updateMessages = updateMessages;