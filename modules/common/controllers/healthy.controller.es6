const packageJson = require('../../../package.json');
const healthyCheckDao = require('../daos/healthyCheck.dao.es6');
const request = require('request-promise');
const envConfig = require('../../../config/env.config.es6');

exports.check = (req, res) => {
    let log = req.log;
    let response = {
        "status": "green",
        "application": packageJson.name,
        "version": packageJson.version,
        "pipelineVersion": packageJson.pipelineVersion,
        "memory": process.memoryUsage(),
        "checks": {
            "database": 'green',
            "elasticsearch": "green"
        }
    };

    let databasePromise = healthyCheckDao.healthyCheck()
        .catch(() => {
            response.status = 'red';
            response.checks.database = 'red';
        });


    let elasticsearchPromise = checkElastic(response);

    Promise.all([databasePromise, elasticsearchPromise])
        .then(() => {
            //log.info({healthCheck: response}, 'healthcheck result');
            if (response.status !== 'red') {
                return res.send(200, response);
            } else {
                return res.send(503, response);
            }
        })
        .catch(() => {
            //log.info({healthCheck: response}, 'healthcheck result');
            return res.send(500, response);
        });
};

function checkElastic(result) {
    let options = {method: 'GET', url: `http://${envConfig.elasticsearch.host}/_cluster/health`, json: true};
    return request(options).then((res) => {
        if (res.status) {
            result['checks']['elasticsearch'] = res.status;
            if (res.status !== 'green' && result.status !== 'red') {
                result.status = 'yellow';
            }
        }
    }, () => {
        if (result.status !== 'red') {
            result.status = 'yellow';
        }
        result['checks']['elasticsearch'] = 'red';
    });
}

exports.health = (req, res) => {
    res.send(200);
};
