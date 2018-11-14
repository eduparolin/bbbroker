const Chip = require('./Chip');
const CommonError = require('../common/common.error.js');
const signalService = require('./services/signal.service.es6');

function create(req, res) {
    req.body.received = 0;
    req.body.sent_on_net = 0;
    req.body.sent_off_net = 0;
    Chip.create(req.body)
        .then((id) => {
            res.send(201, id);
        })
        .catch((err) => {
            let commonErr = new CommonError(500, 'SEQUELIZE_ERROR', req.reqId, err.message, []);
            res.send(500, commonErr);
        });
}

function update(req, res) {
    Chip.update(req.body, {where: {id: req.params.chipId}})
        .then((id) => {
            res.send(204);
        })
        .catch((err) => {
            let commonErr = new CommonError(500, 'SEQUELIZE_ERROR', req.reqId, err.message, []);
            res.send(500, commonErr);
        });
}

async function list(req, res) {
    let chips = await Chip.findAll({
        include: {
            all: true
        }
    });
    res.send(200, chips);
}

function getOne(req, res) {
    Chip.getChipById(req.params.chipId)
        .then((chip) => {
            res.send(200, chip);
        }).catch((err) => {
            let commonErr = new CommonError(404, 'NOT_FOUND', req.reqId, err.message, []);
            res.send(404, commonErr);
        });
}

function remove(req, res) {
    Chip.destroy({
        where: {
            id: req.params.chipId
        }
    })
        .then(() => {
            res.send(204);
        })
        .catch((err) => {
            let commonErr = new CommonError(500, 'SEQUELIZE_ERROR', req.reqId, err.message, []);
            res.send(500, commonErr);
        });
}

function getSignals(req, res) {
    signalService.getSignalInfo(req.log)
        .then((response) => {
            res.send(200, response);
        })
        .catch((err) => {
            let error = new CommonError(500, 'SQL_ERROR', req.reqId, err, []);
            res.send(500, error);
        })
}

exports.create = create;
exports.update = update;
exports.list = list;
exports.getOne = getOne;
exports.remove = remove;
exports.getSignals = getSignals;
