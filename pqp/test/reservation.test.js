require('./testFixtures').mockLog();
const producerDao = require('../app/producer/producer.daos/producer.dao');
const reservationService = require('../app/producer/services/reservation.service');

xdescribe('Reservation Test', function () {
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
                done(err);
            })
    });

    it('Reserve and Get Messages', async function () {
          await reservationService.reserveAndGetMessages(20000);
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
            })
    })
});