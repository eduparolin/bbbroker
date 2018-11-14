const elasticsearch = require('elasticsearch');
const log = require('./log.service.es6');
const chronographjs = require('chronographjs');

let client = false;

function connect(host, logger) {
    if (!logger) {
        logger = log.child({module: 'elastic.service'});
    }
    logger.info({elasticConfig: {host}}, 'Creating a connection with the host');
    client = new elasticsearch.Client({
        host: host.host,
        log: 'warning'
    });
}


function search(index, query, logger) {
    let timer = new chronographjs.getTimer();
    if (!logger) {
        logger = log.child({module: 'elastic.service'});
    }

    if (!client) {
        logger.warn('The elastic client is actually disconnected, try to call the connect method with a valid Elastic host.');
        return Promise.reject('The elastic client is actually disconnected, try to call the connect method with a valid Elastic host.');
    }
    timer.start('elasticSearch');
    let queryObj = {'body': JSON.parse(query), 'index': index};

    return new Promise((resolve, reject) => {
        client.search(queryObj)
            .then((result) => {
                timer.stop('elasticSearch');
                let timers = {
                    elasticSearch: timer.time('elasticSearch').msecs(),
                    total: timer.total().msecs()
                };


                if (result && result.hits && result.hits.hits && result.hits.hits.length > 0 && result.hits.hits[0].fields && result.hits.hits[0].fields.value) {
                    result['_shards']['failures'] = {};
                    logger.debug({
                        elasticReport: {query, result, timers}
                    }, ' elastic search successful');
                    resolve({
                        value: result.hits.hits[0].fields.value[0],
                        updateAt: new Date(result.hits.hits[0]['_source']['@timestamp'])
                    });
                } else {
                    logger.warn({
                        elasticReport: {query, result, timers}
                    }, ' elastic search not found');
                    reject('Not Found')
                }

            }, (error) => {
                timer.stop('elasticSearch');
                let timers = {
                    elasticSearch: timer.time('elasticSearch').msecs(),
                    total: timer.total().msecs()
                };
                logger.error({
                    elasticReport: {query, error, timers}
                }, ' elastic search failed');

                reject(error);
            })
    });

}


exports.connect = connect;
exports.search = search;
































































































































