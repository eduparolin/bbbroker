const CommonError = require('./../common/common.error');
const Gateway = require('./Gateway');

function getGatewayById(req, res) {
    Gateway.getGatewayById(req.params.id)
        .then((gateway) => {
            res.send(200, gateway);
        })
        .catch((err) => {
            let commonErr = new CommonError(404, 'NOT_FOUND', req.reqId, err.message, []);
            res.send(404, commonErr);
        });
}

async function listGateway(req, res) {
    let gateways = await Gateway.findAll();
    res.send(200, gateways);
}

function updateGateway(req, res) {
    Gateway.updateGateway(req.body, req.params.id)
        .then((id) => {
            res.send(204, id);
        })
        .catch((err) => {
            let commonErr = new CommonError(404, 'NOT_FOUND', req.reqId, err.message, []);
            res.send(404, commonErr);
        });
}

function createGateway(req, res) {
    Gateway.create(req.body)
        .then((id) => {
            res.send(201, id);
        })
        .catch((err) => {
            let commonErr = new CommonError(500, 'SEQUELIZE_ERROR', req.reqId, err.message, []);
            res.send(500, commonErr);
        });
}

function deleteGateway(req, res) {
    Gateway.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.send(204);
    }).catch((err) => {
        let commonErr = new CommonError(400, 'SEQUELIZE_ERROR', req.reqId, err.message, []);
        res.send(400, commonErr);
    });
}

exports.createGateway = createGateway;
exports.updateGateway = updateGateway;
exports.getGatewayById = getGatewayById;
exports.listGateway = listGateway;
exports.deleteGateway = deleteGateway;
