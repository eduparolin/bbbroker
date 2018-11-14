const moment = require('moment');

function parseDate(date) {
    date = decodeURIComponent(date).replace(',', ' ');
    date = date.substring(0, 17);
    return new Date(moment(date, 'YY/MM/DD HH:mm:ss').format());
}

function parseChannelReference(cdrChannel) {
    let splitedSmsChannel = cdrChannel.split('/');
    let smsBoard = (splitedSmsChannel[1].length === 2) ? splitedSmsChannel[1] : '0' + splitedSmsChannel[1];

    let smsChannel;

    if(splitedSmsChannel[2].length === 1){
        smsChannel = '00' + splitedSmsChannel[2];
    } else if (splitedSmsChannel[2].length === 2) {
        smsChannel = '0' + splitedSmsChannel[2];
    } else {
        smsChannel = splitedSmsChannel[2];
    }

    return `B${smsBoard}C${smsChannel}`;
}

function parseIdentification(identification) {
    if(identification.length === 12) {
        let date = moment(identification, 'YYMMDDHHmmss');
        let dateFiveMax = new Date(date.add(5, 'minutes').add(3, 'hours').format());
        let dateFiveMin = new Date(date.subtract(10, 'minutes').format());

        return [dateFiveMax,dateFiveMin];
    }
}

function parseDeliveredDate(deliveredDate) {
    let delivered = moment(deliveredDate).add(3, 'hours').format();
    return new Date(delivered);
}

exports.parseDate = parseDate;
exports.parseChannelReference = parseChannelReference;
exports.parseIdentification = parseIdentification;
exports.parseDeliveredDate = parseDeliveredDate;
