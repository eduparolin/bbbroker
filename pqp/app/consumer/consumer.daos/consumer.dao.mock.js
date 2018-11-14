
function updateMessageStatus(status, messagePayload, logger) {
    return Promise.resolve();
}

function updateMessageStatusFail(status, messagePayload, logger) {
    return Promise.reject();
}


function updateMessageStatusByProvider(status, messagePayload, logger) {
    let res = {
        affectedRows:5
    };
    return res;
}

function updateMessageStatusByProviderNonAffectedRows(status, messagePayload, logger) {
    let res = {
    };
    return res;
}

function updateMessageStatusByProviderFail(status, messagePayload, logger) {
    return Promise.reject();
}

exports.updateMessageStatus = updateMessageStatus;
exports.updateMessageStatusFail = updateMessageStatusFail;
exports.updateMessageStatusByProvider = updateMessageStatusByProvider;
exports.updateMessageStatusByProviderNonAffectedRows = updateMessageStatusByProviderNonAffectedRows;
exports.updateMessageStatusByProviderFail = updateMessageStatusByProviderFail;