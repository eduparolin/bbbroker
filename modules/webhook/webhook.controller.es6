const xmlExtractorService = require('../freeswicth/services/xmlExtractor.service.es6');
const cdrService = require('../freeswicth/services/cdr.service');
const mickeyService = require('../mickey/services/mickey.service.es6');
const webhookService = require('../webhook/services/webhook.service');
const Sms = require('../sms/Sms');
const Cdr = require('../sms/Cdr');
const Channel = require('../channel/Channel');
const Chip = require('../chips/Chip');
const discoveryService = require('../chips/services/discovery.service');
const uuid = require('uuid/v4');

exports.messageReceived = async (req, res) => {
    let logger = req.log;
    let cdrMapped = cdrMapper(req.body);
    req.log.debug({cdrMessageReceived: cdrMapped}, "cdrMessageReceived");
    if (!cdrMapped.sms_text) {
        res.send(200);
        return;
    }

    let channel, chip, cdr;

    try {
        cdr = await Cdr.create({
            id: uuid(),
            content: cdrMapped.sms_text,
            channel_ref: cdrMapped.sms_channel,
            host: cdrMapped.host,
            status: 'PENDING'
        });
    } catch (e) {
        req.log.error({cdrCreateError: e}, 'cdrCreateError');
    }

    try {
        channel = await Channel.getChannelByReference(cdrMapped.host, cdrService.parseChannelReference(cdrMapped.sms_channel));
        chip = await Chip.getChipByChannelId(channel.id);
    } catch (e) {
        res.send(500, e);
        return;
    }

    if (/Message for .*/.test(cdrMapped.sms_text)) {
        let destination = cdrMapped.sms_text.match(/(?!Message for +55)(\d{11})(?=,)/)[0];
        if (/.* identification .* delivered on .*/.test(cdrMapped.sms_text)) {
            let identification = cdrMapped.sms_text.match(/(?!identification )(\d{12})(?= has )/)[0];
            let delivered = cdrMapped.sms_text.match(/(\d{4}-\d{2}-\d{2} at \d{2}:\d{2}:\d{2})/)[0].replace(' at ', 'T');
            //new update
            let [ sent_at_max, sent_at_min ] = cdrService.parseIdentification(identification);
            try {
                let sms = await Sms.updateSmsByDate(cdrService.parseDeliveredDate(delivered), sent_at_max, sent_at_min, destination);
                await webhookService.sendWebhookSMS(sms, chip.route.webhook_dlr)
                    .then(() => {
                        //dlr
                        try{
                            cdr.processed();
                        } catch (e) {
                            req.log.error({cdrUpdateError: e}, 'cdrUpdateError');
                        }
                        res.send(200);
                    })
                    .catch(() => {
                        res.send(500);
                    });
            } catch (e) {
                res.send(500, e);
            }
        } else {
            let identification = cdrMapped.sms_text.match(/(?!identification )(\d{12})(?= could )/)[0];
            let [ sent_at_max, sent_at_min ] = cdrService.parseIdentification(identification);

            try {
                let sms = await Sms.updateSmsByDate(cdrService.parseDeliveredDate(new Date()), sent_at_max, sent_at_min, destination, 'ERROR');
                await webhookService.sendWebhookSMS(sms, chip.route.webhook_dlr)
                    .then(() => {
                        //dlr
                        try{
                            cdr.processed();
                        } catch (e) {
                            req.log.error({cdrUpdateError: e}, 'cdrUpdateError');
                        }
                        res.send(200);
                    })
                    .catch(() => {
                        res.send(500);
                    });
            } catch (e) {
                res.send(500, e);
            }
        }
    } else if (cdrMapped.sms_text && cdrMapped.sms_text.replace(/\s+/g, '').startsWith('mkey:')) {
        cdrMapped.sms_text = cdrMapped.sms_text.replace(/\s+/g, '');
        logger.debug({mickeySms: {text: cdrMapped.sms_text}}, 'mickey sms received');
        handleMickeySMS(cdrMapped, logger).then(() => {
            try{
                cdr.processed();
            } catch (e) {
                req.log.error({cdrUpdateError: e}, 'cdrUpdateError');
            }
            res.send(200);
        }).catch(() => {
            res.send(500);
        });

    } else if (cdrMapped.sms_text && cdrMapped.sms_text.startsWith('disc:')) {
        logger.debug({discoverySms: {text: cdrMapped.sms_text}}, 'discovery sms received');
        handleDiscoverySMS(cdrMapped, logger).then(() => {
            try{
                cdr.processed();
            } catch (e) {
                req.log.error({cdrUpdateError: e}, 'cdrUpdateError');
            }
            res.send(200);
        }).catch((err) => {
            res.send(500, err);
        });

    } else {
        //recv
        if(chip && chip.route) {
            let smsContent = {
                chip_id: chip.id,
                channel_id: channel.id,
                route_id: chip.route.id,
                direction: 'INBOUND',
                origin: cdrMapped.sms_from,
                destination: chip.number,
                message: cdrMapped.sms_text,
                status: ('RECEIVED'),
                webhook_result: 'PENDING',
                sent_at: cdrService.parseDate(cdrMapped.sms_date)
            };

            let sms = await Sms.create(smsContent);
            await webhookService.sendWebhookSMS(sms, chip.route.webhook_recv)
                .then(() => {
                    try{
                        cdr.processed();
                    } catch (e) {
                        req.log.error({cdrUpdateError: e}, 'cdrUpdateError');
                    }
                    res.send(200);
                })
                .catch(() => {
                    res.send(500);
                });
        } else {
            logger.error({cdrChipError: {error: 'noChipFound'}}, 'cdrChipError');
            res.send(500);
        }
    }
};

function handleMickeySMS(cdr, logger) {
    let textSplit = cdr.sms_text.split(':');
    let smsId = textSplit[1];
    let timezoneOffset = 10800000;
    let receivedAt = Date.now() - timezoneOffset;

    logger.debug({mickeySmsInfo: {smsId, receivedAt, timezoneOffset}}, 'mickey sms info');
    return mickeyService.setDelivered(smsId, receivedAt, logger);
}

function handleDiscoverySMS(cdr, logger) {
    let textSplit = cdr.sms_text.split(':');
    let channelId = textSplit[1];
    let operator = textSplit[2];

    logger.debug({discoverySmsInfo: {channelId, operator}}, 'discovery sms info');
    return discoveryService.discovererChip(channelId, cdr.caller_id_number, operator,logger);
}

function cdrMapper(xml) {
    let mapping = {
        'cdr_uuid': 'cdr/variables/uuid',
        'start_stamp': 'cdr/variables/start_stamp',
        'answer_stamp': 'cdr/variables/answer_stamp',
        'end_stamp': 'cdr/variables/end_stamp',
        'sip_hangup_disposition': 'cdr/variables/sip_hangup_disposition',
        'hangup_cause': 'cdr/variables/hangup_cause',
        'hangup_cause_q850': 'cdr/variables/hangup_cause_q850',
        'sip_term_status': 'cdr/variables/sip_term_status',
        'billsec': 'cdr/variables/billsec',
        'duration': 'cdr/variables/duration',
        'direction': 'cdr/variables/direction',
        'chip_uuid': 'cdr/variables/chip_uuid',
        'caller_id_number': 'cdr/callflow/caller_profile/caller_id_number',
        'destination_number': 'cdr/callflow/caller_profile/destination_number',
        'chip_destination_prefix': 'cdr/variables/chip_destination_prefix',
        'chip_destination_number': 'cdr/variables/chip_destination_number',
        'callback_destination_number': 'cdr/variables/callback_destination_number',
        'sip_from_host': 'cdr/variables/sip_from_host',
        'host': 'cdr/variables/host',
        'hostname': 'cdr/@switchname',
        'sms_from': 'cdr/variables/KSmsFrom',
        'sms_date': 'cdr/variables/KSmsDate',
        'sms_text': 'cdr/variables/KSmsBody',
        'sms_channel': 'cdr/variables/channel_name',
        'login': 'cdr/variables/user',
        'password': 'cdr/variables/pass',
        'route_type': 'cdr/variables/route_type',
        'route_uuid': 'cdr/variables/route_uuid',
        'pilot_number': 'cdr/variables/pilot_number',
        'cadence': 'cadence'
    };

    return xmlExtractorService.extract(xml, mapping);
}

exports.handleMickeySMS = handleMickeySMS;
