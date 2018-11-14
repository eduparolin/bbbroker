const Sms = require('../../sms/Sms');
const Route = require('../../routes/Route');
const webhookService = require('./webhook.service');

async function retrySms() {
    let pendingSms = await Sms.getSmsByPendingWebhook();
    let promises = [];
    for (let sms of pendingSms) {
        let route = await Route.getRouteById(sms.route_id);
        let webhookUrl = (sms.direction === 'INBOUND') ? route.webhook_recv : route.webhook_dlr;
        promises.push(webhookService.sendWebhookSMS(sms, webhookUrl));
    }

    return Promise.all(promises);
}

exports.retrySms = retrySms;
