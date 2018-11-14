const [Sequelize, sequelize] = require('../common/services/database.service')();

const Sms = sequelize.define('sms',
    {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        route_id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false},
        channel_id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4},
        chip_id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false},
        direction: {type: Sequelize.ENUM('INBOUND', 'OUTBOUND'), allowNull: false},
        origin: {type: Sequelize.STRING(45), allowNull: false},
        destination: {type: Sequelize.STRING(45), allowNull: false},
        message: {type: Sequelize.STRING(255), allowNull: false},
        sent_at: {type: Sequelize.DATE, allowNull: false},
        delivered_at: {type: Sequelize.DATE},
        status: {type: Sequelize.STRING(45), default: 'SENT'},
        webhook_attempts: {type: Sequelize.INTEGER, default: 0},
        webhook_result: {type: Sequelize.STRING(45), default: 'PENDING'}
    },
    {
        tableName: 'sms'
    }
);

Sms.prototype.increaseWebhookAttempt = function () {
    return this.update({
        webhook_attempts: Sequelize.literal('webhook_attempts + 1')
    });
};

Sms.prototype.updateWebhookResult = async function (result) {
    await this.update({
        webhook_result: result
    });
    return this.increaseWebhookAttempt();
};

Sms.prototype.delivered = function () {
    return this.update({
        delivered_at: Sequelize.fn('NOW'),
        status: 'DELIVERED'
    });
};

Sms.updateSmsByDate = async function (deliveredAt, sent_at_max, sent_at_min, destination, status = 'DELIVERED') {
    let affectedRows = await sequelize.query(
        'UPDATE sms\n' +
        '    SET delivered_at = :deliveredAt, status = :status\n' +
        '        WHERE destination = :destination\n' +
        '            AND sent_at <= :sent_at_max\n' +
        '                AND sent_at >= :sent_at_min\n' +
        '                    AND delivered_at IS NULL\n' +
        '    ORDER BY sent_at DESC\n' +
        '    LIMIT 1',
        {
            replacements: {
                deliveredAt: deliveredAt,
                status: status,
                destination: destination,
                sent_at_max: sent_at_max,
                sent_at_min: sent_at_min
            },
            type: sequelize.QueryTypes.UPDATE
        });

    if (affectedRows[1] > 0) {
        return this.findOne({
            where: {
                destination: destination,
                delivered_at: deliveredAt - new Date(10800000)
            }
        });
    } else {
        throw new Error('no affected rows');
    }
};

Sms.getSmsByPendingWebhook = function () {
    return this.findAll({
            where: {
                [Sequelize.Op.or]: [{status: 'RECEIVED'}, {status: 'DELIVERED'}],
                webhook_result: {[Sequelize.Op.notLike]: 'SENT'}
            }
        }
    );
};

module.exports = Sms;
