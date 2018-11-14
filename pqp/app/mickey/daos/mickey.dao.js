const database = require('../../common/services/database.service');
const config = require('../../config/env.config');

exports.shouldTest = (logger) => {
    let query = `SELECT COUNT(*) quantity FROM MO_ESMS WHERE ST_MO_MOES = 'QUEUED' AND DT_ENVIO_MOES BETWEEN DATE_ADD(CURDATE(), INTERVAL ${config.mickey.initialHour} HOUR) AND DATE_ADD(CURDATE(), INTERVAL ${config.mickey.finalHour} HOUR)`;

    return database.runQuery(query, [], logger, 'shouldTest');
};