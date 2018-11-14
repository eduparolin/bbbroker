const validateJsonSchema = require('jsonschema').validate;
const uuid = require('uuid/v1');

const validateCreate = {
    "type": "object",
    "properties": {
        "name": {"type":"string"},
        "status": {
            "type": "string",
            "enum": [
                "FREE",
                "BUSY"
            ]
        },
        "chips": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "active": {
                        "type": "boolean"
                    },
                    "id": {
                        "type": "string"
                    },
                    "position": {
                        "type": "integer",
                        "enum": [
                            0,
                            1
                        ]
                    }
                },
                "required": [
                    "active",
                    "id",
                    "position"
                ]
            }
        }
    },
    "required": [
        "name"
    ],
    "additionalProperties": false
};

const validateUpdate = validateCreate;

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
        res.send(400, generateErrorJson(400, 'BAD_REQUEST', uuid(), 'Invalid status', errors));
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
        res.send(400, generateErrorJson(400, 'BAD_REQUEST', uuid(), 'Invalid status', errors));
    }
};

exports.validateChipActive = (req, res, next) => {
    let active = false;
    for (let chip of req.body.chips) {
        if (chip.active && active) {
            res.send(400, generateErrorJson(400, 'BAD_REQUEST', req.reqId, 'Invalid chips actives', []));
        } else if (chip.active) {
            active = true;
        }
    }
    next();
};

exports.validateChannel = (req, res, next) => {
    req.params = req.params || {};
    if(req.params.id) {
        next();
    } else {
        res.send(400, generateErrorJson(400, 'BAD_REQUEST', uuid(), 'Invalid channel', ['Channel must not be null']));
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