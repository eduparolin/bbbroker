const [Sequelize, sequelize] = require('../common/services/database.service')();
//const Channel = require('../channel/Channel');
const Route = require('../routes/Route');
const Channel = require('../channel/Channel');

const Chip = sequelize.define('chip',
    {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        number: {type: Sequelize.STRING(15), allowNull: false},
        received: {type: Sequelize.INTEGER, allowNull: false},
        sent_on_net: {type: Sequelize.INTEGER, allowNull: false},
        limit_on_net: {type: Sequelize.INTEGER, allowNull: false},
        sent_off_net: {type: Sequelize.INTEGER, allowNull: false},
        limit_off_net: {type: Sequelize.INTEGER, allowNull: false},
        operator: {type: Sequelize.STRING(10), allowNull: false},
        base_day: {type: Sequelize.STRING(2), allowNull: false}
    },
    {
        tableName: 'chip'
    }
);

Chip.prototype.increaseSentOnNet = function() {
    return this.increment('sent_on_net');
};


Chip.prototype.increaseSentOffNet = function() {
    return this.increment('sent_off_net');
};

Chip.getChipById = function (id) {
    let chip = this.findById(id);

    if (!chip) {
        throw new Error('Chip not found');
    }

    return chip;
};

Chip.getChipByNumber = function (number) {
    let chip = this.findOne({
        where: {
            number: number
        }
    });

    if (!chip) {
        throw new Error('Chip not found');
    }

    return chip;
};

Chip.getChipByChannelId = function (channelId) {
    return this.findOne({
        where: {
            channel_id: channelId
        },
        include: {
            all: true
        }
    });
};

module.exports = Chip;
