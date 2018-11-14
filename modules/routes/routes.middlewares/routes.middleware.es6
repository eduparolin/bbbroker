const validateJsonSchema = require('jsonschema').validate;
const uuid = require('uuid/v1');

const validateUpdate = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "webhook_dlr": {"type": "string"},
        "webhook_recv": {"type": "string"}
    },
    "additionalProperties": false
};

const validateCreate = {
    "type": "object",
    "properties": {
        "name": {"type": "string", "required": true},
        "prefix": {"type": "string", "required": true},
        "webhook_dlr": {"type": "string"},
        "webhook_recv": {"type": "string"}
    },
    "additionalProperties": false
};

exports.validateUpdate = (req, res, next) => {
    req.body = req.body || {};
    let result = validateJsonSchema(req.body, validateUpdate);
    if(result.valid) {
        next();
    } else {
        let errors = [];
        for(let error of result.errors) {
            errors.push(error.stack);
        }
        res.send(400, generateErrorJson(400, 'BAD_REQUEST', uuid(), 'Invalid params', errors));
    }
};

exports.validateCreate = (req, res, next) => {
    req.body = req.body || {};
    let result = validateJsonSchema(req.body, validateCreate);
    if(result.valid) {
        next();
    } else {
        let errors = [];
        for(let error of result.errors) {
            errors.push(error.stack);
        }
        res.send(400, generateErrorJson(400, 'BAD_REQUEST', uuid(), 'Invalid params', errors));
    }
};

function generateErrorJson(code, errorCode, reqId, message, errors) {
    return {
        httpStatusCode: code,
        errorCode: errorCode,
        reqId: reqId,
        message: message,
        errors: errors
    }
}
