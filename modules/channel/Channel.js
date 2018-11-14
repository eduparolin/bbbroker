const [Sequelize, sequelize] = require('../common/services/database.service')();
const uuid = require('uuid/v4');
const Chip = require('../chips/Chip');

const Gateway = require('../gateways/Gateway');

const Channel = sequelize.define('channel', {
    id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
    gateway_id: {type: Sequelize.UUID, allowNull: false},
    status: {type: Sequelize.ENUM('FREE', 'BUSY'), allowNull: false},
    gw_reference: {type: Sequelize.STRING(36), allowNull: false},
    reservation: {type: Sequelize.UUID}
}, {tableName: 'channel'});

Channel.prototype.free = function () {
    return this.update({
        status: 'FREE'
    });
};

Channel.prototype.busy = function () {
    return this.update({
        status: 'BUSY'
    });
};

Channel.prototype.sendSms = async function (destinationNumber, text, smsContent, operator) {

    let chip;

    try {
        chip = await Chip.getChipByChannelId(this.id);
    } catch (e) {
        return this.free();
    }

    smsContent.channel_id = this.id;
    smsContent.chip_id = chip.id;
    smsContent.origin = chip.number;

    return this.Gateway.sendSms(this.gw_reference, destinationNumber, text, smsContent)
        .then(async (response) => {
            console.log(this.reservation);
            if (chip.operator === operator) {
                await chip.increaseSentOnNet();
            } else {
                await chip.increaseSentOffNet();
            }
            return Promise.resolve(response);
        })
        .finally(async () => {
            this.free();
        });
};

Channel.reserveAndGetChannel = async function (route, operator) {
    let reservation = uuid();
    return sequelize.query(
        `UPDATE channel SET status = 'BUSY', reservation = :reservation WHERE id IN (SELECT channel_id FROM (
                     SELECT ch.id channel_id, (IF(c.operator = :operator, c.limit_on_net - c.sent_on_net, c.limit_off_net - c.sent_off_net)) remaining_limit
                     FROM channel ch 
                     JOIN chip c ON c.channel_id = ch.id
                     JOIN route r ON c.route_id = r.id 
                     WHERE r.prefix = :route AND ch.status = 'FREE'
                     HAVING remaining_limit > 0
                     ORDER BY remaining_limit DESC LIMIT 5) AS list
                     ORDER BY RAND()) LIMIT 1`,
        {
            replacements: {
                reservation: reservation,
                route: route,
                operator: operator
            },
            type: sequelize.QueryTypes.UPDATE
        }).then((result) => {
        let updatedRows = result[1];
        if (updatedRows === 0) {
            return Promise.reject('Could not reserve channel ');
        }

        return this.findOne({
            where: {
                reservation: reservation
            },
            include: [
                {model: Gateway}
            ]
        });
    })
        .catch((err) => {
            return Promise.reject(err);
        })
};

Channel.getChannelByReference = function (gatewayIdIp, reference) {
    return this.findOne({
        where: {
            gw_reference: reference
        },
        include: [
            {
                model: Gateway,
                where: {
                    [Sequelize.Op.or]: [{id: gatewayIdIp}, {ip: gatewayIdIp}],
                }
            }
        ]
    });
};

module.exports = Channel;
