const database = require('../services/connection.gsm.service.es6'),
    sqlQuery = require('bluebird');

exports.healthyCheck = () => {
    let customQuery = "select 1+1 ";
    return sqlQuery.using(database.getConnection(), (connection) => {
        return connection.query(customQuery, []);
    });
};