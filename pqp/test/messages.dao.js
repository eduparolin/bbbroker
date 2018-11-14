const config = require('../app/config/env.config');
const db = require('../app/common/services/database.service');

function createMessage(message, logger) {
    let query = `INSERT INTO ${config.sms_config.table_name} SET ?;`;
    let params = [message];
    return db.runQuery(query, params, logger, 'Create message');
}

function getMessage(id, logger) {
    let query = `SELECT * FROM ${config.sms_config.table_name} WHERE ID_MO_MOES = ?;`;
    let params = [id];

    return db.runQuery(query, params, logger, 'getMessage');
}

function remove(msgUuid, logger) {
    let query = `DELETE FROM ${config.sms_config.table_name} WHERE ID_MO_MOES = ?;`;
    return db.runUpdate(query, [msgUuid], logger, 'Delete message');
}

exports.createMessage = createMessage;
exports.getMessage = getMessage;
exports.remove = remove;