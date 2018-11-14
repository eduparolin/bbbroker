const validateJsonSchema = require('jsonschema').validate;
const CommonError = require('../../common/common.error.js');
const schemaPost = {

        "type": "object",
        "properties": {
            "channel_id": {"type": "string"},
            "route_id": {"type": "string"},
            "number": {"type": "string"},
            "received": {"type": "integer"},
            "sent_on_net": {"type": "integer"},
            "sent_off_net": {"type": "integer"},
            "limit_on_net": {"type": "integer"},
            "limit_off_net": {"type": "integer"},
            "base_day": {"type": ["integer", "string"]},
            "operator": {"type": "string"}
        },
        "required":
            [
                "number",
                "limit_on_net",
                "limit_off_net",
                "base_day",
                "operator"
            ],
        "additionalProperties":
            true
    }
;

function validateSchema(req, res, next) {
    req.body = req.body || {};
    let result = validateJsonSchema(req.body, schemaPost);
    if (result.valid) {
        if (req.body.base_day > 0 && req.body.base_day < 29) {
            next();
        } else if (!Number.isInteger(req.body.base_day)) {
            next();
        } else {
            let errors = {
                description: 'Fill in with a day between 1 and 28',
                type: 'INPUT_VALIDATION',
                field: 'base_day'
            };
            let err = new CommonError(400, 'INVALID_PARAMETERS', req.reqId, 'Invalid Parameters', errors);
            res.send(400, err);
        }
    } else {
        console.log(result);

        let errors = {
            description: result.errors[0].message,
            type: 'INPUT_VALIDATION',
            field: result.errors[0].argument
        };
        let err = new CommonError(400, 'INVALID_PARAMETERS', req.reqId, 'Invalid Parameters', errors);
        res.send(400, err);
    }
}

exports.validateSchema = validateSchema;
