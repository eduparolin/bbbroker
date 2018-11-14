const Channel = require('../../channel/Channel');
const FreeSwitch = require('../../freeswicth/FreeSwitch');
const waitChip = require('./waitChip.service.js');
const logger = require('../../common/services/log.service.es6');

async function switchChip(gatewayId, reference, slot, run) {
    if(run) {
        logger.trace({switchingChip: reference, slot}, 'switchingChip');
        let channel = await Channel.getChannelByReference(gatewayId, reference);
        let gateway = channel.Gateway;
        await channel.busy();

        let [board, ch] = reference.split("C");
        board = board.substr(1, 2);

        let command = `khomp select sim  ${board} ${ch} ${slot}`;
        return FreeSwitch.runCommand(gateway.ip, command)
            .then((result) => {
                if (result.indexOf('OK')) {
                    waitChip.runJob(gateway.ip, [board, ch], channel, slot, true);
                    return Promise.resolve();
                } else {
                    return Promise.reject('khomp error - failed to select chip');
                }
            })
            .catch((err) => {
                channel.free();
                logger.trace({switchingChipError: err}, 'switchingChipError');
            });
    } else {
        return Promise.resolve();
    }
}

exports.switchChip = switchChip;
