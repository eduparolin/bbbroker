const config = require('../../config/env.config');
const db = require('../../common/services/database.service');

function updateMessageStatus(status, messagePayload, logger) {
    let params = [];

    params.push(status);
    params.push(messagePayload.providerTag);
    params.push(messagePayload.providerId);
    params.push(messagePayload.ID_MO_MOES);

    let query = 'UPDATE ' + config.sms_config.table_name;
    let setParams = ['ST_MO_MOES = ?', 'CD_GATEWAY_MOES = ?', 'DT_AGENDAMENTO_MOES = SYSDATE()', 'NR_MESSAGE_ID_MOES = ?'];
    let whereParams = ['ID_MO_MOES = ?', "ST_MO_MOES != 'DELIVERED'"];

    if (setParams.length) {
        query += ' SET ' + setParams.join(', ');
    }
    if (whereParams.length) {
        query += ' WHERE ' + whereParams.join(' AND ');
    }

    return db.runQuery(query, params, logger, "updateMessageStatus")
        .then(function () {
            return Promise.resolve();
        }).catch(function (err) {
            return Promise.reject(err);
        });
}

function updateMessageStatusByProvider(status, messagePayload, moId, logger) {
    let params = [];

    params.push(status);
    params.push(messagePayload.providerTag);
    params.push(moId);

    let query = 'UPDATE ' + config.sms_config.table_name;
    let setParams = ['ST_MO_MOES = ?', 'CD_GATEWAY_MOES = ?', 'DT_ENTREGA_MOES = SYSDATE()'];
    let whereParams = ['ID_MO_MOES = ?'];

    if (setParams.length) {
        query += ' SET ' + setParams.join(', ');
    }
    if (whereParams.length) {
        query += ' WHERE ' + whereParams.join(' AND ');
    }

    return db.runQuery(query, params, logger, 'updateMessageStatusByProvider');
}

exports.updateMessageStatus = updateMessageStatus;
exports.updateMessageStatusByProvider = updateMessageStatusByProvider;