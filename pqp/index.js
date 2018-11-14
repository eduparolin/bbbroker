const server = require('./app/app');
const logService = require('./app/common/services/log.service');

process.on('uncaughtException', function (err) {
    logService.error({uncaughtException: err}, 'uncaughtException');
    console.error(err);
});

server.listen(5000, function() {
    console.log('%s listening at %s', server.name, server.url);
});