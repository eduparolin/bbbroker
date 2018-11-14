const mysql = require('promise-mysql'),
    config = require('../../config/env.config'),
    sqlQuery = require('bluebird'),
    log = require('../../common/services/log.service'),
    chronographjs = require('chronographjs');

let pool = mysql.createPool(config.mysql_pool);

function getConnection() {
    return pool.getConnection().disposer(function (connection) {
        pool.releaseConnection(connection);
    });
}

function getPool() {
    return pool;
}

/**
 *
 * @param query The SQL query
 * @param params The parameters to be bound
 * @param logger A logger instance
 * @param name The Query name
 * @returns {Promise}
 */
function runQuery(query, params = [], logger, name, type = 'Query') {
    var timer = new chronographjs.getTimer();
    if (!logger) {
        logger = log.child({module: 'connection.service'});
    }
    timer.start('getConnection');
    return sqlQuery.using(getConnection(), (connection) => {
        timer.stop('getConnection');
        timer.start('query');
        return connection.query(query, params).then(
            (result) => {
                timer.stop('query');
                let timers = {
                    connection: timer.time('getConnection').msecs(),
                    query: timer.time('query').msecs(),
                    total: timer.total().msecs()
                };
                logger.debug({
                    sqlReport: {query, params, result, timers}
                }, '%s %s successful', type, name);
                return result;
            },
            (error) => {
                timer.stop('query');
                let timers = {
                    connection: timer.time('getConnection').msecs(),
                    query: timer.time('query').msecs(),
                    total: timer.total().msecs()
                };
                logger.error({
                    sqlReport: {query, params, error, timers}
                }, '%s %s failed', type, name);
                return Promise.reject(error);
            }
        );
    });
}

/**
 * Same as runQuery but rejects the promise if no affectedRows
 */
function runUpdate(query, params, logger, name) {
    return runQuery(query, params, logger, name, 'Update').then((result) => {
        if (result.affectedRows) {
            return result;
        } else {
            return Promise.reject(result);
        }
    })
}

exports.getConnection = getConnection;
exports.runQuery = runQuery;
exports.runUpdate = runUpdate;
exports.getPool = getPool;