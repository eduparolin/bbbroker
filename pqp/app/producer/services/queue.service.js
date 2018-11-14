const rp = require('request-promise');
const config = require('../../config/env.config');
const log = require('../../common/services/log.service');
const messageDao = require('../daos/messages.dao');
const filterDao = require('../../consumer/consumer.daos/filter.dao');
const retryService = require('./retry.service');

exports.startQueuing = async (messages, filterMessages) => {

    try {
        await retryService.retry(filterDao.bulkInsert.bind(filterDao, filterMessages, log));
    } catch (e) {
        log.error({producerFilterBulkInsert: e}, 'producerFilterBulkInsert');
    }

    let insertOptions = {
        method: 'POST',
        url: config.message_insert.url,
        resolveWithFullResponse: true,
        json: messages
    };

    return rp(insertOptions).then((res) => {
        let updates = [];
        if (res.statusCode === 201) {
            updates.push(messageDao.updateProcedure(JSON.parse(messages[0].payload).NR_GESTAO_FORNECEDOR_GTES, 1, log));
        } else if (res.statusCode === 207) {
            for (let i in res.body) {
                if (res.body[i].status === 400) {
                    updates.push(messageDao.updateIndividual(JSON.parse(messages[i].payload).ID_MO_MOES), log);
                }
            }
        }
        return Promise.all(updates).catch((err) => {
            //console.log(err);
            //log.error({queueUpdateError:err}, 'queueUpdateError');
        });
    }).catch((err) => {
        if (err.statusCode === 400) {
            return messageDao.updateProcedure(JSON.parse(messages[0].payload).NR_GESTAO_FORNECEDOR_GTES, 0, log).catch((err) => {
                log.error({queueUpdateError: err}, 'queueUpdateError');
            });
        }
    });
};