require('./testFixtures').mockLog();
const queue = require('../app/producer/services/queue.service');
const producerDao = require('../app/producer/producer.daos/producer.dao');

xdescribe('PGMais Test', function () {
    this.timeout(20000);
    const messageCount = 28;
    before('before anything', (done) => {
        let promises = [];
        for(let i  = 0; i<messageCount; i++){
            promises.push(producerDao.insertMoEsmsMessages(i));
        }
        Promise.all(promises)
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err);
            })
    });

    it('test', function (done) {
        let startTotal = new Date();
        let startQueue;
        producerDao.listWaitingMessages('20000', 'WAITING')
            .then((messages) => {
                return setPayloadToMessages(messages, 'TEST_TAG');
            })
            .then(function (messageToQueue) {
                startQueue = new Date();
                return queue.startQueuing(messageToQueue);
            })
            .then((response) => {
                console.log('Queue Execution time:', new Date() - startQueue, 'ms');
                //console.log('finalTime:', process.hrtime()[1]/1000000);
            })
            .catch((err) => {
                //console.log('finalTime:', process.hrtime()[1]/1000000);
                console.log(err);
            })
            .finally(() => {
                console.info('Total Execution time:', new Date() - startTotal, 'ms');
                done();
            })
    });

    after('kill all data', (done) => {
        let promises = [];
        for(let i  = 0; i<messageCount; i++){
            promises.push(producerDao.deleteMoEsmsMessages(i));
        }
        Promise.all(promises)
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err);
            })
    })
});

function setPayloadToMessages(messages, tag) {
    let messagePost = [];
    messages.forEach(function (message) {
        let insertItem = {};

        insertItem.schedule = message.DT_ENVIO_MOES;

        message = JSON.stringify(message);

        insertItem.payload = message;

        insertItem.tag = tag;

        messagePost.push(insertItem);
    });

    return Promise.resolve(messagePost);
}