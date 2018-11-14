function mandatoryBodyFields(req, res, next, fields) {
    if (fields.length) {
        if (req.body) {
            fields.forEach(field => {
                if (!req.body[field]) {
                    return res.send(400, {error: field + ' is mandatory field.'});
                }
            });
            return next();
        } else {
            return res.send(400, {error: 'It is necessary to send a body.'});
        }

    }
    return next();
}

function numberFields(req, res, next, fields) {
    if (fields.length) {
        if (req.body) {
            fields.forEach(field => {
                if (isNaN(req.body[field])) {
                    return res.send(400, {error: field + ' needs to be a number.'});
                }
            });
            next();
        } else {
            return res.send(400, {error: 'It is necessary to send a body.'});
        }
    }
}

function isArrayField(req, res, next, fields) {
    if (fields.length) {
        if (req.body) {
            fields.forEach(field => {
                if(req.body[field]){
                    if (!(req.body[field] instanceof Array)) {
                        return res.send(400, {error: field + ' needs to be an array.'});
                    }
                }
            });
            next();
        } else {
            return res.send(400, {error: 'It is necessary to send a body.'});
        }
    }
}

exports.mandatoryBodyFields = mandatoryBodyFields;
exports.numberFields = numberFields;
exports.isArrayField = isArrayField;