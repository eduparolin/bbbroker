const CommonError = require('../../common/common.error.js');
const Route = require('../../routes/Route');

async function sendSms(req, res) {
    let prefix = req.body.from;
    let destinationNumber = req.body.to;
    let text = req.body.message;
    let operator = req.body.operator;

    try {
        let route = await Route.getRouteByPrefix(prefix);
        route.sendSms(operator, destinationNumber, text)
            .then((smsId) => {
                res.send(201, smsId);
            })
            .catch((err) => {
                let commonError = new CommonError(500, 'SEND_SMS_ERROR', req.reqId, err.message, err);
                res.send(500, commonError);
            })
    } catch (routeError) {
        //FIXME, sendSms by number
        let commonError = new CommonError(500, 'SEND_SMS_ERROR', req.reqId, routeError.message, routeError);
        res.send(500, commonError);
    }
}

exports.sendSms = sendSms;
