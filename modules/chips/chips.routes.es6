const chipsMiddleware = require('./middlewares/chips.middleware.es6');
const chipsController = require('./chips.controller.es6');
const authMiddleware = require('../common/middlewares/auth.middleware.es6');
const chipsJsonSchemaPostMiddleware = require('./middlewares/chip.schema.middleware.es6');

function route(server) {
    server.post('/chips', [
        authMiddleware.authentication,
        chipsJsonSchemaPostMiddleware.validateSchema,
        chipsController.create
    ]);

    server.put('/chips/:chipId', [
        authMiddleware.authentication,
        chipsJsonSchemaPostMiddleware.validateSchema,
        chipsController.update
    ]);

    server.get('/chips', [
        authMiddleware.authentication,
        chipsController.list
    ]);

    server.get('/chips/:chipId', [
        authMiddleware.authentication,
        chipsMiddleware.exists,
        chipsController.getOne
    ]);

    server.del('/chips/:chipId', [
        authMiddleware.authentication,
        chipsController.remove
    ]);

    server.get('/chipsSignals', [
        authMiddleware.authentication,
        chipsController.getSignals
    ]);
}

exports.route = route;
