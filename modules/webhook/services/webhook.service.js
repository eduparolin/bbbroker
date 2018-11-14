const Request = require('request-promise');
const logger = require('../../common/services/log.service.es6');

async function sendWebhookSMS(sms, webhookUrl) {
    let post = {
        method: 'POST',
        uri: webhookUrl,
        body: {id: sms.id ,message: sms.message, timestamp: sms.sent_at, number: sms.origin},
        json: true
    };

    logger.debug({sendWebhookSMSParams: post}, 'sendWebhookSMSParams');

    return Request(post)
        .then(() => {
            return sms.updateWebhookResult('SENT');
        })
        .catch((e) => {
            logger.error({sendWebhookSMSError: e}, 'sendWebhookSMSError');
            return sms.updateWebhookResult('ERROR');
        });
}

exports.sendWebhookSMS = sendWebhookSMS;
