const rp = require('request-promise');
const routeObject = require('../../route/tag.object');
const mickeyDaos = require('../daos/mickey.dao');
const logger = require('../../common/services/log.service');
const config = require('../../config/env.config');

exports.sendTestSMS = () => {
    return mickeyDaos.shouldTest(logger)
        .then(function (result) {
            if (result[0].quantity > 0) {
                let route = routeObject.get();
                let allTags = route.tags;
                let promises = [];
                for (let tag of allTags) {
                    let options = {
                        method: 'POST',
                        url: config.mickey.url,
                        json: true,
                        body: {
                            providerId: tag.tag
                        },
                        resolveWithFullResponse: true
                    };
                    logger.debug({sendMickeySmsOptions: options}, 'sendMickeySms');
                    promises.push(rp(options)
                        .catch(function (err) {
                            return Promise.reject(err);
                        }));
                }

                return Promise.all(promises);

                //return Promise.resolve();
            }
        })
        .catch(function (err) {
            logger.debug({sendTestSMSError: err}, 'sendTestSMSError');
            return Promise.reject(err);
        })
};