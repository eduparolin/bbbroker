const esl = require('../../modesl');
const log = require('../common/services/log.service.es6').child({module: 'FreeSwitch'});

class FreeSwitch {

    static runCommand(host, command) {
        log.trace(command);
        return new Promise((resolve, reject) => {
            let connection = new esl.Connection(host, 8021, 'ClueCon', function () {
                connection.api(command, function (res) {
                    resolve(res.getBody());
                    connection.disconnect();
                });
            });

            function errorHandler(){
                log.error('connection failed');
                reject('connection failed');
            }

            connection.on('esl::end', errorHandler);
            connection.on('error', errorHandler);
        });
    }

    static sendSms(host, channel, destinationNumber, text) {
        text = !text.startsWith('*not#') ? '*not#' + text : text;
        let command = `khomp sms ${channel} ${destinationNumber} ${text}`;
        let resultMessage = 'Message sent successfully!';
        return FreeSwitch.runCommand(host,command).then((result)=>{
            if (result.indexOf(resultMessage) === 0) {
                log.info(resultMessage);
                return Promise.resolve(resultMessage);
            } else {
                log.error('Failed to send Message');
                return Promise.reject('Failed to send Message');
            }
        });
    }

    static listChannels(host) {
        let command = `khomp show channels`;
        return FreeSwitch.runCommand(host,command).then((result)=>{
            if (result.length) {
                log.info(result);
                return result;
            } else {
                log.error('Failed to get channels');
                return Promise.reject('Failed to get channels');
            }
        });
    }

    static getChannel(host, board, channel) {
        let command = `khomp show channels ${board} ${channel}`;
        return FreeSwitch.runCommand(host,command).then((result)=>{
            if (result.length) {
                log.info(result);
                return result;
            } else {
                log.error('Failed to get channels');
                return Promise.reject('Failed to get channels');
            }
        });
    }
}

module.exports = FreeSwitch;
