const webhookController = require('./webhook.controller.es6');

function route(server) {
    server.post('/cdr',[
        webhookController.messageReceived
    ]);
}

exports.route = route;