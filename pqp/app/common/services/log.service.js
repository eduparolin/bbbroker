const bunyan = require('bunyan'),
    Elasticsearch = require('bunyan-elasticsearch'),
    envConfig = require('../../config/env.config');

const esStream = new Elasticsearch(envConfig.elasticsearch);
esStream.on('error', function (err) {
    console.log('Elasticsearch Stream Error:', err.stack);
});

module.exports = bunyan.createLogger({
    name: envConfig.elasticsearch.logName,
    level: envConfig.elasticsearch.logLevel,
    streams: [
        //{stream: esStream}
        {stream: process.stdout}
    ],
    serializers: bunyan.stdSerializers
});
