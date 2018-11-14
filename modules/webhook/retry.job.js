const retryService = require('./services/retry.service');

function startSmsRetry() {
    retryService.retrySms()
        .then(() => {
            setTimeout(startSmsRetry, 1000 * 60);
        })
        .catch(() => {
            setTimeout(startSmsRetry, 1000 * 90);
        })
}

exports.startSmsRetry = startSmsRetry;
