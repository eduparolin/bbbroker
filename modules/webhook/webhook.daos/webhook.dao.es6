const database = require('../../common/services/connection.gsm.service.es6');
const uuid = require('uuid/v4');

exports.updateDelivered = (destination, identification, deliveredTime, logger) => {
    let query = 'UPDATE sms_report \
        SET delivered_at = ?, status = ?, status_updated_at = CURRENT_TIMESTAMP \
        WHERE destination = ? \
        AND sent_at <= ? \
        AND sent_at >= ? \
        AND delivered_at IS NULL \
        ORDER BY sent_at DESC \
        LIMIT 1';
    let sent = parseIdentification(identification);
    let params = [deliveredTime, 'DELIVERED', destination, sent[0], sent[1]];
    return database.runUpdate(query, params, logger, 'webhook update');
};

exports.saveSmsRadar = (channelName, origin, message, logger) => {
    let query = 'SELECT c.number AS destination, c.id AS chip_id, ch.id AS channel_id, r.id AS route_id FROM channel ch \
        INNER JOIN channel_has_chip AS chc ON chc.channel_id = ch.id \
        INNER JOIN chip AS c ON c.id = chc.chip_id \
        INNER JOIN route_has_channel AS rhc ON rhc.channel_id = ch.id \
        INNER JOIN route AS r ON r.id = rhc.route_id \
        WHERE ch.name = ? AND chc.active = ?';
    let matches = channelName.match(/(?:Khomp_SMS\/)(\d*)(?:\/)(\d*)/);
    let channel;
    if(parseInt(matches[2]) > 9) {
        channel = 'b0' + matches[1] + 'c0' + matches[2];
    } else {
        channel = 'b0' + matches[1] + 'c00' + matches[2];
    }
    let params = [channel, true];
    return database.runQuery(query, params, logger, 'get ids')
        .then((rows) => {
            if(rows.length) {
                let query = 'INSERT INTO sms_radar (id, chip_id, channel_id, route_id, destination, origin, message, webhook_result) VALUES (?,?,?,?,?,?,?,?)';
                let params = [uuid(), rows[0].chip_id, rows[0].channel_id, rows[0].route_id, rows[0].destination, origin, message, 'PENDING'];
                return database.runQuery(query, params, logger, 'save sms radar');
            } else {
                return Promise.reject();
            }
        });
};

function parseIdentification(identification) {
    if(identification.length === 12) {
        let res = [];
        let year = '20' + identification.charAt(0) + identification.charAt(1);
        let month = identification.charAt(2) + identification.charAt(3);
        let day = identification.charAt(4) + identification.charAt(5);
        let hour = identification.charAt(6) + identification.charAt(7);
        let min = identification.charAt(8) + identification.charAt(9);
        let sec = identification.charAt(10) + identification.charAt(11);
        let date = new Date(year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':' + sec);
        let dateFiveMax = new Date(date + 5*60*1000);
        let dateFiveMin = new Date(date - 5*60*1000);
        date = new Date(date + 30*1000);
        res.push(dateFiveMax);
        res.push(dateFiveMin);
        return res;
    }
}