const routeController = require('./routes.controller.es6');
const routeMiddleware = require('./routes.middlewares/routes.middleware.es6');
const authMiddleware = require('../common/middlewares/auth.middleware.es6');

exports.route = (server) => {
    server.get('/routes/:id',[authMiddleware.authentication, routeController.getRouteById]);
    server.get('/routes', [authMiddleware.authentication, routeController.listRoutes]);
    server.patch('/routes/:id', [authMiddleware.authentication, routeMiddleware.validateUpdate, routeController.updateRoute]);
    server.post('/routes', [authMiddleware.authentication, routeMiddleware.validateCreate, routeController.createRoute]);
    server.del('/routes/:id', [authMiddleware.authentication, routeController.deleteRoute]);
};
