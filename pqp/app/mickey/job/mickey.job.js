const mickeyService = require('../services/mickey.service');
const config = require('../../config/env.config');

function startJob() {
    mickeyService.sendTestSMS()
        .then(function () {
            setTimeout(startJob, config.mickey.jobSuccessTimeout);
        })
        .catch(function (err) {
            setTimeout(startJob, config.mickey.jobFailTimeout);
        })
}

exports.startJob = startJob;