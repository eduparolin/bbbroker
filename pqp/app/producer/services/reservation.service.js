const messagesDao = require('../producer.daos/producer.dao');
const log = require('../../common/services/log.service');

exports.reserveAndGetMessages = async (route) => {
    let affectedRows = 0;
    let desiredSize = 500;
    let messages = [];
    try {
        messages = await messagesDao.reserveProcedure(route, desiredSize, log);
        affectedRows = messages.length;
    } catch (error) {
        log.error({reserveMessageCatch: error}, 'reserveMessageCatch');
    }
    let timeout = getTimeout(messages, desiredSize);
    return [messages, timeout, affectedRows];
};

function getTimeout(messages, desiredSize) {
    let numberOfMessages = messages.length;
    let timeout;
    if (numberOfMessages === desiredSize) {
        timeout = 0;
    } else {
        timeout = desiredSize;
    }

    return timeout;
}