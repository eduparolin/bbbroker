const restify = require('restify');
const server = restify.createServer();

const timerMiddleware = require('./common/middlewares/timer.middleware');
const logMiddleware = require('./common/middlewares/log.middleware');

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

require('./common/common.route').attach(server);

server.use(timerMiddleware);
server.use(logMiddleware);

require('./producer/producer.job').produceMessageJob(0);
require('./consumer/services/consumer_job.service').startJob();

module.exports = server;