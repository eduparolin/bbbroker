const config = require('../../config/env.config');
const db = require('../../common/services/database.service');

function listWaitingMessages(route, status, logger) {
    let query = 'SELECT DISTINCT * FROM ' + config.sms_config.table_name;
    let whereParams = ['ST_MO_MOES = ?', 'CD_ROTA_MOES = ?'];
    let params = [status, route];

    if (whereParams.length) {
        query += ' WHERE ' + whereParams.join(' AND ');
        query += ' LIMIT 100';
    }
    return db.runQuery(query, params, logger)
        .then(function (results) {
            return updateMessageStatus('QUEUED', params, logger)
                .then(function () {
                    return results;
                });
        }).catch(function (err) {
            return Promise.reject(err);
        });
}

function getMessagesByReservationId (reservationId, rows, ll) {
    if(!ll){
        ll = 0;
    }else{
        console.log('ll:', ll);
    }
    ll++;
    let query = 'SELECT * FROM MO_ESMS WHERE ST_MO_MOES = ?';
    let params = [reservationId];

    return db.runQuery(query, params)
        .then((messages) => {
            if (messages.length === 0 && rows > 0) {
                //console.log('rows without messages', rows);
                return getMessagesByReservationId(reservationId, rows, ll)
            }
            return Promise.resolve(messages);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        })
};

function reserveMessages(reservationId, route, limit = 100, logger) {
    let query = 'UPDATE esms.MO_ESMS as sms\n' +
        '        SET sms.ST_MO_MOES = ?\n' +
        '        WHERE sms.CD_ROTA_MOES = ?\n' +
        '        AND sms.ST_MO_MOES = \'WAITING\'\n' +
        '        AND sms.DT_ENVIO_MOES < DATE_ADD(SYSDATE(), INTERVAL 1 MINUTE)\n' +
        '        LIMIT ?';
    let params = [reservationId, route, limit];
    return db.runQuery(query, params, logger);
}

function updateMessageStatus(status, params, logger) {
    let query = 'UPDATE ' + config.sms_config.table_name;
    let setParams = ['ST_MO_MOES = ?'];
    let whereParams = ['ST_MO_MOES = ?', 'CD_ROTA_MOES = ?'];

    params.unshift(status);

    if (setParams.length) {
        query += ' SET ' + setParams.join(', ');
    }
    if (whereParams.length) {
        query += ' WHERE ' + whereParams.join(' AND ');
    }

    return db.runQuery(query, params, logger, 'updateMessageStatus');
}

function insertMoEsmsMessages(id, logger) {
    let query = 'INSERT INTO pgmais_sms.MO_ESMS (ID_MO_MOES, ID_CAMPANHA_MOES, ID_EMPRESA_MOES, DS_SMS_MOES, NR_ORIGEM_MOES, NR_DESTINO_MOES, DT_CADASTRO_MOES, DT_ENVIO_MOES, DT_ENTREGA_MOES, DS_MSGID_MOES, DS_RETORNO_MOES, ST_MO_MOES, NR_MESSAGE_ID_MOES, ID_LOTE_MOES, ST_ORIGEM_MOSC, TP_HIGIENIZACAO_MOSC, CD_STATUS_MOES, ID_ARQ_CEL_MOES, CD_ROTA_MOES, ID_EMPRESA_PAI_MOES, ST_TWO_WAY_MOES, VL_SMS_MOES, ID_OPERADORA_MOES, DS_OBS_MOES, ID_USUARIO_MOES, ID_MO_CONCAT_MOES, CD_GATEWAY_MOES, ID_PRODUTO_MOES, DT_ENVIO_REAL_MOES) VALUES (?, 2937310, 13410, \'Teste Interno GF\', \'\', \'41996682499\', \'2018-08-06 15:52:00\', \'2018-08-06 16:10:20\', null, \'\', null, \'WAITING\', null, 4028829, \'N\', \'O\', null, 7412134463, 20000, 145, \'\', null, 5, null, null, null, null, null, null);';
    let params = [1000 + id];

    return db.runQuery(query, params, logger, 'insertInMoEsms');
}

function deleteMoEsmsMessages(id, logger) {
    let query = 'delete from MO_ESMS where ID_MO_MOES = ?';
    let params = [1000 + id];

    return db.runQuery(query, params, logger, 'deleteFromMoEsms');
}

function reserveProcedure(rota, limit, logger) {
    let query = `call sp_GF_RESERVA_ENVIO(${rota}, ${limit}, 60)`;

    return db.runQuery(query, [], logger, 'reserveProcedure')
        .then(result => {
            return Promise.resolve(JSON.parse(JSON.stringify(result[0])));
        })
}

exports.listWaitingMessages = listWaitingMessages;
exports.updateMessageStatus = updateMessageStatus;
exports.insertMoEsmsMessages = insertMoEsmsMessages;
exports.deleteMoEsmsMessages = deleteMoEsmsMessages;
exports.reserveMessages = reserveMessages;
exports.getMessagesByReservationId = getMessagesByReservationId;
exports.reserveProcedure = reserveProcedure;