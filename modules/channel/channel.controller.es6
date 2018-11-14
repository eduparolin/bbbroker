const CommonError = require('./../common/common.error');
const Channel = require('./Channel');
const Chip = require('../chips/Chip');
const freeswitchService = require('../chips/services/freeswitch.service');

async function listChannel(req, res) {
    let channels = await Channel.findAll({include: {model: Chip}});
    res.send(200, channels);
}

function createChannel(req, res) {
    Channel.bulkCreate(req.body)
        .then((id) => {
            res.send(201, id);
        })
        .catch((err) => {
            let commonErr = new CommonError(500, 'SEQUELIZE_ERROR', req.reqId, err.message, []);
            res.send(500, commonErr);
        });
}

async function switchSlot(req, res) {
    await freeswitchService.switchChip(req.body.gatewayId, req.body.channel, req.body.slotNumber, true);
    res.send(204);
}

exports.createChannel = createChannel;
exports.listChannel = listChannel;
exports.switchSlot = switchSlot;
