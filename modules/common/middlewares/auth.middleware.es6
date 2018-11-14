const jwtService = require('./../services/jwt.service');
const CommonError = require('../../common/common.error.js');

exports.authentication = (req, res, next) => {
    let authorization = req.headers['authorization'];
    if (authorization) {
        let token = authorization.split('Bearer ');
        if (token[1]) {
            jwtService.verifyToken(token[1]).then((data) => {
                req.user = data;
                next();
            }, () => {
                let err = new CommonError(403, 'INVALID_TOKEN', req.reqId, 'invalid JWT token', []);
                res.send(403, err);
            });
        } else {
            let errors = {
                description:'invalid authorization header' ,
                type: 'INVALID_AUTH_HEADER',
                field: 'header'
            };
            let err = new CommonError(401, 'AUTH_ERROR', req.reqId, 'authorization header error', errors);
            res.send(401, err);
        }
    } else {
        let errors = {
            description:'missing authorization header' ,
            type: 'MISSING_AUTH_HEADER',
            field: 'header'
        };
        let err = new CommonError(401, 'AUTH_ERROR', req.reqId, 'authorization header error', errors);
        res.send(401, err);
    }

};