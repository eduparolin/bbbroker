const filterDatabase = require('../../common/services/filter.database.service');

function insertMessage(idMo, message, provider, route, logger) {
    let query = 'INSERT INTO messages(id_mo, message, provider, status, sent_date, route) VALUES (?, ?, ?, ?, ?, sysdate(), ?)';
    let params = [
        idMo,
        message,
        provider,
        'QUEUED',
        route
    ];

    return filterDatabase.runQuery(query, params, logger, 'insertFilterMessage');
}

function bulkInsert(objectArray, logger) {
    let keys = Object.keys(objectArray[0]);
    let values = objectArray.map( obj => keys.map( key => obj[key]));
    let sql = 'INSERT INTO messages (' + keys.join(',') + ') VALUES ?';
    return filterDatabase.runQuery(sql, [values], logger, 'insertBulkFilterMessage');
}

exports.insertMessage = insertMessage;
exports.bulkInsert = bulkInsert;