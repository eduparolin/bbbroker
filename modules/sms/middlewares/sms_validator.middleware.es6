const validateJsonSchema = require('jsonschema').validate;
const CommonError = require('../../common/common.error.js');

const webhookMessage = {
    "type": "object", "properties": {
        "to": {"type": "string", "pattern": "^[0-9]*$"},
        "message": {"type": "string"},
        "from": {"type": "string"},
        "operator": {"type": "string"}
    },
    "required": ["to", "message", "operator", "from"],
    "additionalProperties": false
};

exports.validate = (req, res, next) => {
    let result = validateJsonSchema(req.body, webhookMessage);
    if(result.valid) {
        next();
    } else {
        req.log.error({validateWppWebhookError: result.errors}, 'validateWppWebhookError');
        let errors = {
            description: result.errors[0].message,
            type: 'INPUT_VALIDATION',
            field: result.errors[0].argument
        };
        let err = new CommonError(400, 'INVALID_PARAMETERS', req.reqId, 'Invalid Parameters', errors);
        res.send(400, err);
    }
};