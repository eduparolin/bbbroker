const CommonError = require('./../common/common.error');
const Route = require('./Route');

function createRoute(req, res) {
    Route.create(req.body)
        .then((id) => {
            res.send(201, id);
        })
        .catch((err) => {
            let commonErr = new CommonError(500, 'SEQUELIZE_ERROR', req.reqId, err.message, []);
            res.send(500, commonErr);
        });
}

function updateRoute(req, res) {
    Route.updateRoute(req.body, req.params.id)
        .then((id) => {
            res.send(204, id);
        })
        .catch((err) => {
            let commonErr = new CommonError(404, 'NOT_FOUND', req.reqId, err.message, []);
            res.send(404, commonErr);
        });
}

function getRouteById(req, res) {
    Route.getRouteById(req.params.id)
        .then((route) => {
            res.send(200, route);
        })
        .catch((err) => {
            let commonErr = new CommonError(404, 'NOT_FOUND', req.reqId, err.message, []);
            res.send(404, commonErr);
        });
}

function getRouteByPrefix(req, res) {
    Route.getRouteByPrefix(req.body.name)
        .then((route) => {
            res.send(200, route);
        })
        .catch((err) => {
            let commonErr = new CommonError(404, 'NOT_FOUND', req.reqId, err.message, []);
            res.send(404, commonErr);
        });
}

async function listRoutes(req, res) {
    let gateways = await Route.findAll();
    res.send(200, gateways);
}

function deleteRoute(req, res) {
    Route.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.send(204);
    }).catch((err) => {
        let commonErr = new CommonError(400, 'BAD_REQUEST', req.reqId, err.message, []);
        res.send(400, commonErr);
    })
}

exports.createRoute = createRoute;
exports.updateRoute = updateRoute;
exports.getRouteById = getRouteById;
exports.getRouteById = getRouteById;
exports.listRoutes = listRoutes;
exports.deleteRoute = deleteRoute;

