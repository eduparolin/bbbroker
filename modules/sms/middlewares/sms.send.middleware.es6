const validateJsonSchema = require('jsonschema').validate;

const schema = {
    type: "object",
    properties: {
        to: {type: "string"},
        from: {type: "string"},
        route: {type: "string"},
        text: {type: "string", maximum: "160"}
    },
    required: ["to", "text"],
    additionalProperties: false
};

function validate(req, res, next) {
    req.body = req.body || {};
    let result = validateJsonSchema(req.body, schema);
    if (result.valid) {
        next();
    } else {
        res.send(400, result.errors);
    }
}

exports.validate = validate;