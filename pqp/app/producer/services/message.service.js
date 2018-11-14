const log = require('../../common/services/log.service');


exports.parseMessages = (messages, tag, nextTag, looger = log.child({module: 'message.service'})) => {
    return messages.map((message) => {
        return parseMessage(message, tag, nextTag, looger);
    });
};


function parseMessage(message, tag, nextTag, looger = log.child({module: 'message.service'})) {
    return {
        schedule: message.DT_ENVIO_MOES,
        payload: JSON.stringify(message),
        tag: (message.ID_OPERADORA_MOES === 4) ? tag.name : nextTag.name
    }
}

exports.parseFilterMessages = (messages, tag, routeNumber) => {
    return messages.map((message) => {
        return parseFilterMessage(message, tag, routeNumber);
    });
};

function parseFilterMessage(message, tag, routeNumber) {
    return {
        id_mo: message.ID_MO_MOES,
        message: message.DS_SMS_MOES,
        provider: tag.name,
        status: 'QUEUED',
        route: routeNumber
    }
}