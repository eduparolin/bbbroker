//const log = require('./common/services/log.service.es6');
//const chipService = require('./chips/services/release.service.es6');

process.on('uncaughtException', (error) => {
    console.error(error);
    //log.fatal({module: 'process', error}, 'Uncaught top level error');
});

require('./database/database.service');

const restify = require('restify'),
    timerMiddleware = require('./common/middlewares/timer.middleware.es6'),
    logMiddleware = require('./common/middlewares/log.middleware.es6'),
    commonRouter = require('./common/routes.es6');
const smsRouter = require('./sms/sms.routes'),
    chipRouter = require('./chips/chips.routes.es6'),
    gatewayRouter = require('./gateways/gateways.route.es6'),
    routesRouter = require('./routes/routes.routes.es6'),
    webhookRouter = require('./webhook/webhook.route.es6'),
    channelRouter = require('./channel/channel.route.es6');

const retryJob = require('./webhook/retry.job');

const server = restify.createServer();
server.use(restify.bodyParser({mapParams: false}));
server.use(restify.queryParser());

commonRouter.route(server);

server.use(timerMiddleware);
server.use(logMiddleware);

smsRouter.route(server);
chipRouter.route(server);
webhookRouter.route(server);
channelRouter.route(server);
gatewayRouter.route(server);
routesRouter.route(server);
retryJob.startSmsRetry();

module.exports = server;
