const jwt = require('jsonwebtoken');
const config = require('./../../config/env.config');

exports.generateToken = (data) => {
    let user = Object.assign({}, data);
    delete user.cover;
    delete user.picture;
    return jwt.sign(user, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
};

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                delete decoded.iat;
                delete decoded.exp;
                resolve(decoded);
            }
        });
    });
};