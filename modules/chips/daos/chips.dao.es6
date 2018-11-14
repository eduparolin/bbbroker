const database = require('../../common/services/connection.gsm.service.es6');
const uuid = require('uuid/v1');

function create(chip, logger) {
    let chipUuid = uuid();
    chip.id = chipUuid;
    let query = `INSERT INTO chip SET ?;`;
    let params = [chip];
    return database.runQuery(query, params, logger, 'Create Chip').then(resolution => {
        if (resolution.affectedRows) {
            return chipUuid;
        }
    });
}

function update(chip, logger, chipUuid) {
    let query = `UPDATE chip SET ? WHERE id = ?;`;
    let params = [chip, chipUuid];
    return database.runUpdate(query, params, logger, 'Update Chip');
}

function list(logger) {
    let query = `SELECT c.*,ch.channel_id FROM chip c LEFT JOIN channel_has_chip ch ON c.id = ch.chip_id;`;
    return database.runQuery(query, [], logger, 'Chips List').then(res => {
       return res;
    });
}

function getOne(logger, chipUuid) {
    let query = 'SELECT c.*,ch.channel_id FROM chip c LEFT JOIN channel_has_chip ch ON c.id = ch.chip_id WHERE id = ?;';
    return database.runQuery(query, [chipUuid], logger, 'Get Chip').then((rows) => {
        return rows[0];
    });
}

function remove(logger, chipUuid) {
    let query = 'DELETE FROM `chip` WHERE `id`= ?;';
    return database.runUpdate(query, [chipUuid], logger, 'Delete Chip');
}

function updateStatus(chipUuid, status, logger, mustUpdate = false) {
    let query = 'UPDATE `chip` SET `status` = ? WHERE `chip_uuid`=? AND `status` = ?';
    let method = mustUpdate ? 'runUpdate' : 'runQuery';
    return database[method](query, [status, chipUuid, status === 'BUSY' ? 'FREE' : 'BUSY'], logger, 'UpdateStatus Chip');
}

function getBillTime(chipId, logger) {
    let query = `SELECT ch.chip_uuid, FLOOR(COALESCE(SUM(cdr.billtime) / 60,0)) as total_bill_time
        FROM
        (Select * from chip where chip_uuid = ?) ch
        LEFT JOIN cdr cdr
        ON ch.chip_uuid = cdr.chip_uuid AND (cdr.start_stamp IS NULL OR cdr.start_stamp > DATE(IF(DAY(CURDATE()) < bill_day,
            CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH),'%Y-%m-'),bill_day),
            CONCAT(DATE_FORMAT(CURDATE(), '%Y-%m-'), bill_day))) OR cdr.start_stamp IS NULL)
        WHERE 
		 (cdr.direction IS NULL OR cdr.direction = 'inbound')
		GROUP BY ch.chip_uuid ORDER BY total_bill_time ASC`;

    return database.runQuery(query, [chipId], logger, 'Get bill time').then(res => {
        if (res && res.length) {
            return res[0];
        } else {
            throw 'don\'t have a cdr registry';
        }
    });
}

function getBillTimeForAllChips(logger) {
    let query = `SELECT ch.*, FLOOR(COALESCE(SUM(cdr.billtime) / 60,0)) as total_bill_time, ro.name as route_name
        FROM
        chip ch
       LEFT JOIN cdr cdr
        ON ch.chip_uuid = cdr.chip_uuid AND (cdr.start_stamp IS NULL OR cdr.start_stamp > DATE(IF(DAY(CURDATE()) < bill_day,
            CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH),'%Y-%m-'),bill_day),
            CONCAT(DATE_FORMAT(CURDATE(), '%Y-%m-'), bill_day))) OR cdr.start_stamp IS NULL)
        LEFT JOIN routes ro
		ON ch.routes_route_uuid = ro.route_uuid
       WHERE (cdr.direction IS NULL OR cdr.direction = 'inbound')
		GROUP BY ch.chip_uuid ORDER BY total_bill_time ASC`;

    return database.runQuery(query, [], logger, 'Get bill time for all chips');
}

function _getFreeByPrefix(prefix, ddd = '', logger) {
    let query = `SELECT ch.*, FLOOR(COALESCE(SUM(cdr.billtime) / 60,0)) as total_bill_time 
            FROM
                chip ch
                LEFT JOIN cdr cdr
                ON  ch.chip_uuid = cdr.chip_uuid
                    AND 
                    (cdr.start_stamp IS NULL OR cdr.start_stamp > DATE(IF(DAY(CURDATE()) < bill_day,
                    CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH),'%Y-%m-'),bill_day),
                    CONCAT(DATE_FORMAT(CURDATE(), '%Y-%m-'), bill_day))) OR cdr.start_stamp IS NULL)
                JOIN routes ro
                ON ro.route_uuid = ch.routes_route_uuid
                WHERE  ro.prefix = ?
                AND ch.cid LIKE ?
                AND ch.status = 'FREE'
                AND ch.enabled = 1
                AND (cdr.direction IS NULL OR cdr.direction = 'inbound')
                GROUP BY ch.chip_uuid
                HAVING total_bill_time < ch.minutes_soft
                ORDER BY total_bill_time ASC`;
    return database.runQuery(query, [prefix, `55${ddd}%`], logger, 'getFreeByPrefix Chips')
}

function getFreeByPrefix(prefix, ddd, logger) {
    return _getFreeByPrefix(prefix, ddd, logger).then((result) => {
        if (result.length) {
            return result;
        } else {
            if (ddd) {
                let subDDD = ddd.substr(0, ddd.length - 1);
                return getFreeByPrefix(prefix, subDDD, logger);
            }
            return [];
        }
    });
}

function _getFreeByRouteUuid(route_uuid, ddd = '', logger) {
    let query = `
    SELECT ch.*, FLOOR(COALESCE(SUM(cdr.billtime) / 60,0)) as total_bill_time ,
    (ch.minutes_soft - FLOOR(COALESCE(SUM(cdr.billtime) / 60,0))) as left_minutes 
            FROM
                chip ch
               LEFT JOIN cdr cdr
                ON  ch.chip_uuid = cdr.chip_uuid
                    AND 
                    (cdr.start_stamp IS NULL OR cdr.start_stamp > DATE(IF(DAY(CURDATE()) < bill_day,
                    CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH),'%Y-%m-'),bill_day),
                    CONCAT(DATE_FORMAT(CURDATE(), '%Y-%m-'), bill_day))) OR cdr.start_stamp IS NULL)
                LEFT JOIN routes ro
                ON ro.route_uuid = ch.routes_route_uuid
                WHERE ch.routes_route_uuid = ?
                AND ch.cid LIKE ?
                AND ch.status = 'FREE'
                AND ch.enabled = 1
                AND (cdr.direction IS NULL OR cdr.direction = 'inbound')
                GROUP BY ch.chip_uuid
                HAVING total_bill_time < ch.minutes_soft
                ORDER BY left_minutes DESC`;
    return database.runQuery(query, [route_uuid, `55${ddd}%`], logger, 'getFreeByPrefix Chips')
}

function getFreeByRouteUuid(route_uuid, ddd, logger) {
    return _getFreeByRouteUuid(route_uuid, ddd, logger).then((result) => {
        if (result.length) {
            return result;
        } else {
            if (ddd) {
                let subDDD = ddd.substr(0, ddd.length - 1);
                return getFreeByRouteUuid(route_uuid, subDDD, logger);
            }
            return [];
        }
    });
}
function getChipByCid(cid, logger) {
    let query = `SELECT * FROM chip WHERE cid = ?`;
    return database.runQuery(query, [cid], logger, 'getChipByCid')
}

function getChipByChannelAndHost(channel, host, logger) {
    let query = `SELECT * FROM chip WHERE channel = ? AND host = ?`;
    return database.runQuery(query, [channel, host], logger, 'getChipByChannelAndHost').then((rows) => {
        return rows[0];
    });
}

function getChipHosts(logger) {
    let query = 'SELECT DISTINCT host FROM chip';
    return database.runQuery(query, [], logger, 'getChipHosts')
}
function _getFreeByGenericRoute(ddd = '', logger) {
    let query = `SELECT ch.*, FLOOR(COALESCE(SUM(cdr.billtime) / 60,0)) as total_bill_time 
            FROM
                chip ch
               LEFT JOIN cdr cdr
                ON  ch.chip_uuid = cdr.chip_uuid
                    AND 
                    (cdr.start_stamp IS NULL OR cdr.start_stamp > DATE(IF(DAY(CURDATE()) < bill_day,
                    CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH),'%Y-%m-'),bill_day),
                    CONCAT(DATE_FORMAT(CURDATE(), '%Y-%m-'), bill_day))) OR cdr.start_stamp IS NULL)
                WHERE ch.cid LIKE ?
                AND ch.status = 'FREE'
                AND ch.exclusive = 0
                AND ch.enabled = 1
                AND (cdr.direction IS NULL OR cdr.direction = 'inbound')
                GROUP BY ch.chip_uuid
                HAVING total_bill_time < ch.minutes_soft
                ORDER BY total_bill_time ASC`;
    return database.runQuery(query, [`55${ddd}%`], logger, 'getFreeByPrefix Chips')
}

function getFreeByGenericRoute(ddd, logger) {
    return _getFreeByGenericRoute(ddd, logger).then((result) => {
        if (result.length) {
            return result;
        } else {
            if (ddd) {
                let subDDD = ddd.substr(0, ddd.length - 1);
                return getFreeByGenericRoute(subDDD, logger);
            }
            return [];
        }
    });
}

function releaseChips(logger) {
    let query = 'UPDATE `chip` SET `status` = ? WHERE `status` = ? AND DATE_ADD(updated_at, INTERVAL 2 HOUR) < CURRENT_TIMESTAMP ';
    return database.runQuery(query, ['FREE', 'BUSY', ], logger, 'releaseChip');
}

function updateSent(id, operator, logger) {
    let query = 'UPDATE chip SET sent_on_net = CASE WHEN operator = ? THEN sent_on_net + 1 ELSE sent_on_net END, \
                                 sent_off_net = CASE WHEN operator != ? THEN sent_off_net + 1 ELSE sent_off_net END \
                 WHERE reference = ?';
    let params = [operator, operator, id];
    return database.runUpdate(query, params, logger, 'update sent');
}

function checkSent(id, operator, logger) {
    let query = 'SELECT * FROM chip WHERE id = ?';
    let params = [id];
    return database.runQuery(query, params, logger, 'select sent and limit')
        .then((rows) => {
            if(rows.length) {
                if(rows[0].operator === operator && rows[0].limit_on_net === rows[0].sent_on_net) {
                    return Promise.reject('Limit of sending sms reached');
                } else if(rows[0].operator !== operator && rows[0].limit_off_net === rows[0].sent_off_net) {
                    return Promise.reject('Limit of sending sms reached');
                } else {
                    return rows;
                }
            }
        })

}

function getChipByChannel(channelId, logger) {
    let query = `SELECT r.id AS route_id, ch.id AS channel_id, c.id AS chip_id, c.number AS number FROM chip c 
                 JOIN channel_has_chip chc ON chc.chip_id = c.id
                 JOIN channel ch ON ch.id = chc.channel_id 
                 JOIN route_has_channel rhc ON rhc.channel_id = ch.id
                 JOIN route r ON r.id = rhc.route_id
                 WHERE ch.id = ?`;
    let params = [channelId];
    return database.runQuery(query, params, logger, 'getChipByChannel')
        .then((rows) => {
            return rows[0];
        });
}

function getChipByNumber(from, logger) {
    let query = 'select chc.chip_id, chc.channel_id, ch.reference, ch.number from chip as ch inner join channel_has_chip chc on ch.id = chc.chip_id inner join channel as c on c.id = chc.channel_id\n' +
        'where ch.number = ?';
    let params = [from];
    return database.runQuery(query, params, logger, 'getChipByNumber')
        .then((chip) => {
            if(chip.length) {
                return chip[0];
            } else {
                return Promise.reject('No chip');
            }
        });
}

function getChipByRoute(fromRoute, logger) {
    let query = 'select chc.chip_id, c_list.channel_id, ch.reference, ch.number, c_list.route_id from (select rhc.route_id, ' +
        '  rhc.channel_id, channel.status from route_has_channel as rhc inner join route as r on rhc.route_id = r.id\n' +
        '  inner join channel on channel.id = rhc.channel_id where r.route = ?) as c_list\n' +
        '  inner join channel_has_chip as chc on chc.channel_id = c_list.channel_id inner join chip as ch on ' +
        '  chc.chip_id = ch.id where c_list.status = \'FREE\' and chc.active = 1 order by ch.sent_on_net desc';
    let params = [fromRoute];
    return database.runQuery(query, params, logger, 'getChipByRoute')
        .then((chip) => {
            if(chip.length) {
                return chip[0];
            } else {
                return;
            }
        });
}

exports.create = create;
exports.update = update;
exports.list = list;
exports.getOne = getOne;
exports.remove = remove;
exports.updateSatus = updateStatus;
exports.getFreeByRouteUuid = getFreeByRouteUuid;
exports.getBillTime = getBillTime;
exports.getBillTimeForAllChips = getBillTimeForAllChips;
exports.getChipByCid = getChipByCid;
exports.getChipByChannelAndHost = getChipByChannelAndHost;
exports.getFreeByPrefix = getFreeByPrefix;
exports.getChipHosts = getChipHosts;
exports.getFreeByGenericRoute = getFreeByGenericRoute;
exports.releaseChips = releaseChips;
exports.updateSent = updateSent;
exports.checkSent = checkSent;
exports.getChipByChannel = getChipByChannel;
exports.getChipByNumber = getChipByNumber;
exports.getChipByRoute = getChipByRoute;