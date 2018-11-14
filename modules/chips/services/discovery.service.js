const Chip = require('../Chip');
const UUID = require('uuid/v4');

async function discovererChip(channelId, number, operator) {

    if (number.indexOf('+55') !== -1) {
        number = number.replace('+55', '');
    }

    try {
        let chip = await Chip.getChipByNumber(number);
        return Chip.update({
            "channel_id": channelId
        }, {
            where: {
                id: chip.id
            }
        });
    } catch (e) {
        return Chip.create({
            "id": UUID(),
            "route_id": null,
            "channel_id": channelId,
            "number": number,
            "received": 0,
            "operator": operator,
            "sent_on_net": 0,
            "limit_on_net": 1,
            "sent_off_net": 0,
            "limit_off_net": 1,
            "base_day": "1"
        });
    }
}

exports.discovererChip = discovererChip;
