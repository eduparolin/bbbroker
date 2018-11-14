const reservationService = require('./services/reservation.service');
const messageService = require('./services/message.service');
const config = require('../config/env.config');

async function produceMessages(tag, nextTag, routeNumber) {
    let [messages, timeout, aff] = await reservationService.reserveAndGetMessages(config.routeManager.route);
    let parsedMessages = await messageService.parseMessages(messages, tag, nextTag);
    let parsedFilterMessages = await messageService.parseFilterMessages(messages, tag, routeNumber);
    return [timeout, parsedMessages, parsedFilterMessages, aff];
}

exports.produceMessages = produceMessages;