const authMiddleware = require('../common/middlewares/auth.middleware.es6');
const smsMiddleware = require('./middlewares/sms_validator.middleware.es6');
const smsController = require('./controllers/sms.controller.es6');

function route(server) {
    server.post('/sms',[
        authMiddleware.authentication,
        smsMiddleware.validate,
        smsController.sendSms
    ]);
}

exports.route = route;
