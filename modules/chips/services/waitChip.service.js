const FreeSwitch = require('../../freeswicth/FreeSwitch');
const operatorService = require('../../freeswicth/services/operator.service');
const config = require('../../config/env.config');
const logger = require('../../common/services/log.service.es6');
const freeswitchService = require('./freeswitch.service');

let count = 0;

function runJob(host, channelCode, channelEntity, slot) {
    count++;
    return FreeSwitch.getChannel(host, channelCode[0], channelCode[1])
        .then(async (res) => {
            let status = res.split(`${channelCode[0]},${channelCode[1]}`)[1].split('|')[3];
            if ((status.indexOf('error') === -1) && (status.indexOf('Initializing') === -1) &&
                (status.indexOf('Idle (...)') === -1) && (status.indexOf('Ongoing SMS') === -1)) {
                count = 0;
                await channelEntity.free();
                let operator = operatorService.findOperator(status);
                let discoveryMessage = `disc:${channelEntity.id}:${operator}`;

                return FreeSwitch.sendSms(host,
                    channelEntity.gw_reference,
                    config.autoDiscovery.chipNumber,
                    discoveryMessage)
                    .then((resp) => {
                        logger.trace({switchChipJobCompleted: channelCode, discoveryMessage}, 'switchChipJobCompleted');
                        return Promise.resolve();
                    })
            } else if (count < 200) {
                setTimeout(runJob.bind(null, host, channelCode, channelEntity, slot), 1000);
            } else {
                count = 0;
                freeswitchService.switchChip(`B${channelCode[0]}C${channelCode[1]}`, invertSlot(slot), false);
            }
        })
        .catch(() => {
            if (count < 200) {
                setTimeout(runJob.bind(null, host, channelCode, channelEntity, slot), 1000);
            } else {
                count = 0;
                freeswitchService.switchChip(`B${channelCode[0]}C${channelCode[1]}`, invertSlot(slot), false);
            }
        });
}

function invertSlot(slot) {
    if(slot === '1') {
        slot = '0';
    } else {
        slot = '1';
    }
    return slot;
}

exports.runJob = runJob;
