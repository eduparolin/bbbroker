const healthcheckController = require('./controllers/healthy.controller.es6');

function route(server) {
    server.get('/healthcheck', [healthcheckController.check]);
    server.get('/', [healthcheckController.health]);
    server.opts(/.*/, (req, res) => {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        res.send(200);
    });
}

exports.route = route;
