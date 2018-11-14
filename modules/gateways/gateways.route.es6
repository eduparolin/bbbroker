const gatewayController = require('./gateways.controller.es6');
const gatewayMiddleware = require('./gateways.middlewares/gateways.middleware.es6');
const authMiddleware = require('../common/middlewares/auth.middleware.es6');

exports.route = (server) => {
    server.get('/gateways/:id', [authMiddleware.authentication, gatewayController.getGatewayById]);
    server.get('/gateways', [authMiddleware.authentication, gatewayController.listGateway]);
    server.patch('/gateways/:id', [authMiddleware.authentication, gatewayMiddleware.validateUpdate, gatewayController.updateGateway]);
    server.post('/gateways', [authMiddleware.authentication, gatewayMiddleware.validateCreate, gatewayController.createGateway]);
    server.del('/gateways/:id', [authMiddleware.authentication, gatewayController.deleteGateway]);
};
