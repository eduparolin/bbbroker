const [Sequelize, sequelize] = require('../common/services/database.service')();
const Channel = require('../channel/Channel');

const Route = sequelize.define('route',
    {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        name: {type: Sequelize.STRING(25)},
        prefix: {type: Sequelize.STRING(45), allowNull: false},
        webhook_dlr: {type: Sequelize.STRING(255)},
        webhook_recv: {type: Sequelize.STRING(255)}
    },
    {
        tableName: 'route'
    });

Route.prototype.sendSms = function (operator, destinationNumber, text) {

    let smsContent = {
        route_id: this.id
    };

    return Channel.reserveAndGetChannel(this.prefix, operator)
        .then((channel) => {
            return channel.sendSms(destinationNumber, text, smsContent, operator);
        });
};

Route.updateRoute = async function (route, id) {
    let affectedRows = await this.update(route, {
        where: {
            id: id
        }
    });

    if (affectedRows === 0) {
        throw new Error('Route not updated');
    }
};

Route.getRouteById = async function (id) {
    let route = await this.findById(id, {
        rejectOnEmpty: new Error('Route not found'),
        include: [
            {all: true}
        ]
    });
    return route;
};

Route.getRouteByPrefix = async function (prefix) {
    let route = await this.findOne({
        where: {
            prefix: prefix
        },
        rejectOnEmpty: new Error('Route not found')
    });

    return route;
};

module.exports = Route;
