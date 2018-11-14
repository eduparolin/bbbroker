let Mocker = require('../../tests/Mocker');

class Gateway extends Mocker {
    sendSms(channel, destinationNumber, text) {
        if(channel === 'b00c000') {
            return this.shallReject('Failed to send message');
        } else {
            return this.shallResolve('Message sent successfully!');
        }
    }

    getGatewayByName(name) {
        if(name === 'Test123') {
            return this.shallReject('Failed to get gateway');
        } else {
            return this.shallResolve('Gateway found');
        }
    }

    getGatewayByChannel(channel) {
        if(channel === 'b00c000') {
            return this.shallReject('Failed to get gateway');
        } else {
            return this.shallResolve('Gateway found');
        }
    }
}

module.exports = Gateway;
