require('../test/testFixtures').mockLog();

const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const consumerMock = require('../app/consumer/services/consumer.service.mock');

xdescribe('Consumer Controller', function () {
    let consumer = proxyquire('../app/consumer/consumer.controller',
        {
            './services/consumer.service': {
                reserveMessage: consumerMock.reserveMessageFullReservation,
                buryMessage: consumerMock.buryMessage
            }
        });

    it('Should bury messages with reservation limit exceeded successful', async () => {
        let res = await consumer.updateMessages();
        return expect(res).to.be.undefined;
    });

    it('Should not bury messages with reservation limit exceeded successful - HTTP PATCH fail', () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageFullReservation,
                    buryMessage: consumerMock.buryMessageFail
                }
            });
        return expect(consumer.updateMessages()).to.eventually.rejectedWith('buryFail');
    });

    it('Should not reserve message - HTTP GET fail', () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageFail
                }
            });
        return expect(consumer.updateMessages()).to.eventually.rejectedWith('reserveFail');
    });

    it('Should update the information for outgoing messages and remove messages from the queue', async () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageSent,
                    deleteMessage: consumerMock.deleteMessage
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatus: function () {
                        return Promise.resolve()
                    }
                }
            });
        let res = await consumer.updateMessages();
        return expect(res).to.be.undefined;
    });

    it('Should not update the information for outgoing messages - DB UPDATE error', () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {reserveMessage: consumerMock.reserveMessageSent},
                './consumer.daos/consumer.dao': {
                    updateMessageStatus: function () {
                        return Promise.reject('daoFail')
                    }
                }
            });
        return expect(consumer.updateMessages()).to.eventually.rejectedWith('daoFail');
    });

    it('Should not delete/dequeue outgoing messages - DELETE QUEUE error', () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageSent,
                    deleteMessage: consumerMock.deleteMessageFail
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatus: function () {
                        return Promise.resolve()
                    }
                }
            });
        return expect(consumer.updateMessages()).to.eventually.rejectedWith('delFail');
    });

    it('Should not update status by provider for delivered messages - DB UPDATE error', async () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageDelivered,
                    buryMessage: consumerMock.buryMessage
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatusByProvider: function () {
                        return Promise.reject();
                    }
                }
            });
        let res = await consumer.updateMessages();
        return expect(res).to.be.undefined;
    });

    it('Should not update status by provider and not bury delivered messages - DB UPDATE error and HTTP PATCH fail', () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageDelivered,
                    buryMessage: consumerMock.buryMessageFail
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatusByProvider: function () {
                        return Promise.reject();
                    }
                }
            });
        return expect(consumer.updateMessages()).to.eventually.rejectedWith('buryFail');
    });

    it('Should update delivered message by provider, del and remove delivered messages from the queue', async () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageDelivered,
                    deleteMessage: consumerMock.deleteMessage
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatusByProvider: function () {
                        return Promise.resolve({affectedRows: 1});
                    }
                }
            });
        let res = await consumer.updateMessages();
        return expect(res).to.be.undefined;
    });

    it('Should update the delivered message by the provider, but do not bury and remove the delivered message from the queue', () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageDelivered,
                    deleteMessage: consumerMock.deleteMessageFail,
                    buryMessage: consumerMock.buryMessageFail
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatusByProvider: function () {
                        return Promise.resolve({affectedRows: 1});
                    }
                }
            });
        return expect(consumer.updateMessages()).to.eventually.rejectedWith('buryFail');
    });

    it('Should release delivered messages', async () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageDelivered,
                    releaseMessage: consumerMock.releaseMessage
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatusByProvider: function () {
                        return Promise.resolve({affectedRows: 0});
                    }
                }
            });
        let res = await consumer.updateMessages();
        return expect(res).to.be.equal('releaseOk');
    });

    it('Should not release delivered messages and not bury the delivered messages too - HTTP PATCH errors', async () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageDelivered,
                    releaseMessage: consumerMock.releaseMessageFail,
                    buryMessage: consumerMock.buryMessageFail
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatusByProvider: function () {
                        return Promise.resolve({affectedRows: 0});
                    }
                }
            });
        return expect(consumer.updateMessages()).to.eventually.rejectedWith('buryFail');
    });

    it('Should not release delivered messages but should bury the delivered messages', async () => {
        consumer = proxyquire('../app/consumer/consumer.controller',
            {
                './services/consumer.service': {
                    reserveMessage: consumerMock.reserveMessageDelivered,
                    releaseMessage: consumerMock.releaseMessageFail,
                    buryMessage: consumerMock.buryMessage
                },
                './consumer.daos/consumer.dao': {
                    updateMessageStatusByProvider: function () {
                        return Promise.resolve({affectedRows: 0});
                    }
                }
            });
        let res = await consumer.updateMessages();
        return expect(res).to.be.undefined;
    });
});