const controller = require('../../consumer/consumer.controller');
const config = require('../../config/env.config');

function startJob() {
    controller.updateMessages()
        .then(function () {
            setTimeout(startJob, config.consumer_job_options.timeout);
        }).catch(function (err) {
        setTimeout(startJob, config.consumer_job_options.error_timeout);
    });
}

exports.startJob = startJob;