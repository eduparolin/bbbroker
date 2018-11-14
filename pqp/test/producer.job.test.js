const testFixtures = require('../test/testFixtures').mockLog();
const producerDao = require('../app/producer/producer.daos/producer.dao');

const proxyquire = require('proxyquire');
const routeServiceMock = require('../app/route/services/route.service.mock');
const producerController = proxyquire('../app/producer/producer.controller', {
    '../../app/route/services/route.service': routeServiceMock
});
const producerJob = proxyquire('../app/producer/producer.job',
    {
        './services/queue.service':{startQueuing: function () {}},
        './producer.controller': producerController
    });


xdescribe('Producer Test', function () {
    this.timeout(20000);
    const messageCount = 100;
    before('before anything', (done) => {
        let promises = [];
        for (let i = 0; i < messageCount; i++) {
            promises.push(producerDao.insertMoEsmsMessages(i));
        }
        Promise.all(promises)
            .then(() => {
                done()
            })
            .catch((err) => {
                console.log('error',err);
                done(err);
            })
    });

    it('Produce Message', function (done) {
        producerJob.produceMessageJob()
            .then(()=>{
                setTimeout(done, 5000);
            });
    });

    after('kill all data', (done) => {
        let promises = [];
        for (let i = 0; i < messageCount; i++) {
            promises.push(producerDao.deleteMoEsmsMessages(i));
        }
        Promise.all(promises)
            .then(() => {
                done()
            })
            .catch((err) => {
                done(err);
            });
    })
});