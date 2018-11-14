const config = require('../../config/env.config');
const db = require('../../common/services/database.service');

function updateStatus(status, message, logger) {
    let query = `UPDATE ${config.sms_config.table_name} SET ST_MO_MOES = ? WHERE ID_MO_MOES = ?`;
    let params = [status, message.ID_MO_MOES];

    return db.runQuery(query, params, logger, 'updateStatus');
}

function updateStatusByReservationId(status, reservationId, logger) {
    let query = `UPDATE ${config.sms_config.table_name} SET ST_MO_MOES = ? WHERE ST_MO_MOES = ?`;
    let params = [status, reservationId];

    return db.runQuery(query, params, logger, 'updateStatus')
        .catch((err) => {
            if (err.code === 'ER_LOCK_DEADLOCK') {
                return updateStatusByReservationId(status, reservationId, logger);
            } else {
                return Promise.reject(err);
            }
        })
}

function updateProcedure(reservationId, status, logger) {
    let query = `CALL esms.sp_GF_CONFIRMA_ENVIOS(${reservationId}, ${status});`;

    return db.runQuery(query, [], logger, 'updateProcedure');
}

function updateIndividual(idMo, logger) {
    let query = 'UPDATE esms.GATEWAY_ESMS\n' +
        'SET DT_GESTAO_FORNECEDOR_GTES = NULL,\n' +
        '    NR_GESTAO_FORNECEDOR_GTES = NULL\n' +
        'WHERE ID_MO_GTES = ?';

    return db.runQuery(query, [idMo], logger, 'updateIndividual');
}

exports.updateStatus = updateStatus;
exports.updateStatusByReservationId = updateStatusByReservationId;
exports.updateProcedure = updateProcedure;
exports.updateIndividual = updateIndividual;