const validateJsonSchema = require('jsonschema').validate;
const uuid = require('uuid/v1');

const validateUpdate = {
    "type": "object",
    "properties": {
        "name" : {"type": "string"},
        "ip" : {"type": "string"},
        "type" : {"type": "string"},
        "channels" : {"type": "array", "items": {"type": "string"}, "required": false}
    },
    "additionaProperties": false
};

const validateCreate = {
    "type": "object",
    "properties": {
        "name" : {"type": "string", "required": true},
        "ip" : {"type": "string", "required": true},
        "type" : {"type": "string", "required": true},
        "channels" : {"type": "array", "items": {"type": "string"}, "required": false}
    },
    "additionaProperties": false
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
