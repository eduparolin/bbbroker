const channelController = require('./channel.controller.es6');
const channelMiddleware = require('./channel.middlewares/channel.middleware.es6');
const authMiddleware = require('../common/middlewares/auth.middleware.es6');

exports.route = (server) => {
    //server.get('/channels/:id', [authMiddleware.authentication, channelMiddleware.validateChannel, channelController.getChannel]);
    server.get('/channels', [authMiddleware.authentication, channelController.listChannel]);
    //server.patch('/channels/:id', [authMiddleware.authentication, channelMiddleware.validateUpdate, channelController.updateChannel]);
    server.post('/channels', [authMiddleware.authentication, channelController.createChannel]);
    server.post('/slot', [authMiddleware.authentication, channelController.switchSlot]);
    //server.del('/channels/:id', [authMiddleware.authentication, channelController.deleteChannel]);
    //server.del('/channels/chips/:chipId', [authMiddleware.authentication, channelController.deleteChannelChip]);
};
