const FreeSwitch = require('../freeswicth/FreeSwitch');
const [Sequelize, sequelize] = require('../common/services/database.service')();
const Sms = require('../sms/Sms');

let Gateway = sequelize.define('Gateway',
    {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        name: {type: Sequelize.STRING(25)},
        ip: {type: Sequelize.STRING(16), allowNull: false},
        type: {type: Sequelize.STRING(25), allowNull: false}
    },
    {
        tableName: 'gateway'
    });


Gateway.prototype.sendSms = async function (channel, destinationNumber, text, smsContent) {

    smsContent.direction = 'OUTBOUND';
    smsContent.destination = destinationNumber;
    smsContent.message = text;
    smsContent.status = 'SENT';
    smsContent.webhook_result = 'PENDING';
    smsContent.sent_at = new Date();

    let sms = await Sms.create(smsContent);

    return FreeSwitch.sendSms(this.ip, channel, destinationNumber, text)
        .then(() => {
            return Promise.resolve(sms.id);
        })
};

Gateway.updateGateway = async function (gateway, id) {
    let affectedRows = await this.update(gateway, {
        where: {
            id: id
        }
    });

    if (affectedRows === 0) {
        throw new Error('Gateway not updated');
    }
};

/**
 *
 * @param {String} id
 * @returns {Gateway}
 */
Gateway.getGatewayById = async function (id) {
    let gateway = await this.findById(id, {
            rejectOnEmpty: new Error('Gateway not found'),
            include: [
                {all: true}
            ]
        }
    );
    return gateway;
};

module.exports = Gateway;
