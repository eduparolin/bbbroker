const Route = require('../routes/Route');
const Chip = require('../chips/Chip');
const Channel = require('../channel/Channel');
const Gateway = require('../gateways/Gateway');


Chip.belongsTo(Route, {foreignKey: 'route_id', targetKey: 'id'});
Route.hasMany(Chip, {foreignKey: 'route_id', targetKey: 'id'});
Chip.belongsTo(Channel, {foreignKey: 'channel_id', targetKey: 'id'});
Channel.hasMany(Chip, {foreignKey: 'channel_id', targetKey: 'id'});
Channel.belongsTo(Gateway, {foreignKey: 'gateway_id', targetKey: 'id'});
Gateway.hasMany(Channel, {foreignKey: 'gateway_id', targetKey: 'id'});

exports.Route = Route;
exports.Chip = Chip;
