const commonController = require('./common.controller');

exports.attach = (server) => {
    server.opts(/\.*/, (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
        return next();
    }, (req, res) => {
        res.send(200);
    });
    server.get('/healthcheck', [commonController.healthcheck]);
    server.get('/', [commonController.healthcheck]);

};