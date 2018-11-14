const config = require('./config/env.config.es6'),
    server = require('./modules/app.es6'),
    logService = require('./modules/common/services/log.service.es6');

process.on('uncaughtException', function (err) {
    logService.error({uncaughtException: err}, 'uncaughtException');
});

server.listen(config.port, function () {
    console.log('listening at port %s', config.port);
});