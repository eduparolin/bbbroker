const commonMiddleware = require('../../common/middlewares/common.middleware.es6');
const chipDao = require('../daos/chips.dao.es6');
const CommonError = require('../../common/common.error.js');

function mandatoryFields(req, res, next) {
    let fields = ['cid', 'channel', 'minutes_soft', 'minutes_hard', 'bill_day', 'host', 'cadence'];
    return commonMiddleware.mandatoryBodyFields(req, res, next, fields);
}

function cadenceIsValid(req, res, next) {
    let validationArray = req.body.cadence.split('/');
    if (validationArray && validationArray.length === 2) {
        if (isNaN(validationArray[0]) || isNaN(validationArray[1])) {
            res.send(400, {error: 'cadence is invalid.'});
        } else {
            next();
        }
    } else {
        res.send(400, {error: 'cadence is invalid.'});
    }
}

function isNumber(req, res, next) {
    let fields = ['minutes_soft', 'minutes_hard', 'bill_day'];
    return commonMiddleware.numberFields(req, res, next, fields);
}

function hardMinutesValidation(req, res, next) {
    if (parseInt(req.body.minutes_hard) > parseInt(req.body.minutes_soft)) {
        next();
    } else {
        res.send(400, {error: 'minutes_hard needs to be greater than minutes_soft'});
    }
}

function exists(req, res, next) {
    chipDao.getOne(null, req.params.chipId).then((chip) => {
        if (chip) {
            next();
        } else {
            let err = new CommonError(404, 'NOT_FOUND', req.reqId, 'Chip not found', []);
            res.send(404, err);
        }
    });
}

exports.isNumber = isNumber;
exports.mandatoryFields = mandatoryFields;
exports.hardMinutesValidation = hardMinutesValidation;
exports.cadenceIsValid = cadenceIsValid;
exports.exists = exists;