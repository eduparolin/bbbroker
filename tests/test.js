var proxyquire = require('proxyquire');
var request = require('supertest');
var app = require('../modules/app.es6');
var sendSmsStub = {
    sendSMSEsl: function (smsUuid, gateway, channel, to, message) {
        var channels = {};
        return new Promise(function (resolve, reject) {
            if (message === "randomFailure" && Math.random() > 0.9) {
                return reject("booooo");
            }

            if (message === "failure") {
                return reject("booooo");
            }

            if (!channels[channel] || channels[channel] === "free") {
                channels[channel] = "busy";
                setTimeout(function () {
                    channels[channel] = "free";
                    resolve("yay");
                }, Math.random() * 3000);
            } else {
                setTimeout(function () {
                    channels[channel] = "free";
                    reject("booooo");
                }, Math.random() * 500);
            }
        });
    }
};

xdescribe('PGMais Broker SMS test', function () {
    var sendSMS = proxyquire('../modules/sms/controllers/sms.controller.es6', {'../../freeswicth/services/sms.service.es6': sendSmsStub});
    this.timeout(10000);
    it('Send sms by chip test OK', function (done) {
        sendSMS.sendSMS({
            body: {
                "to": "41996424069",
                "message": "TestOK",
                "from": "41984252757",
                "operator": "OI"
            },
            log: {
                debug: function () {
                },
                info: function () {
                },
                error: console.error
            }
        }, {
            send: function (code) {
                if (code !== 201) {
                    done(new Error());
                }
                else {
                    done();
                }
            }
        });
    });
    it('Send sms by chip test ERROR', function (done) {
        sendSMS.sendSMS({
            body: {
                "to": "41996424069",
                "message": "TestError",
                "from": "1234567890",
                "operator": "OI"
            },
            log: {
                debug: function () {
                },
                info: function () {
                },
                error: console.error
            }
        }, {
            send: function (code) {
                if (code !== 201) {
                    done();
                }
                else {
                    done(new Error());
                }
            }
        })
    });
    for(var i = 0; i < 10; i++) {
        it('Send sms by route test OK ' + i, function (done) {
            sendSMS.sendSMS({
                body: {
                    "to": "41996424069",
                    "message": "TestOK " + i,
                    "from": "EBS1",
                    "operator": "OI"
                },
                log: {
                    debug: function () {
                    },
                    info: function () {
                    },
                    error: console.error
                }
            }, {
                send: function (code) {
                    if (code !== 201) {
                        done(new Error());
                    }
                    else {
                        done();
                    }
                }
            });
        });
    }
    it('Send sms by route test ERROR', function (done) {
        sendSMS.sendSMS({
            body: {
                "to": "41996424069",
                "message": "TestError",
                "from": "NOTvalid",
                "operator": "OI"
            },
            log: {
                debug: function () {
                },
                info: function () {
                },
                error: console.error
            }
        }, {
            send: function (code) {
                if (code !== 201) {
                    done();
                }
                else {
                    done(new Error());
                }
            }
        });
    });
});
xdescribe('PGMais Broker SMS Limit test', function () {
    var sendSMS = proxyquire('../modules/sms/controllers/sms.controller.es6', {'../../freeswicth/services/sms.service.es6': sendSmsStub});
    var authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphcnZpc0B0dW50c2NvcnAuY29tIn0.jhQhM8L3N31hhGfXKfG6m6OuorJVhieciNBGkkKbn5w'
    this.timeout(10000);
    it('Send sms on OK', function (done) {
        request(app)
            .put('/chips/b2f95b20-86bc-11e8-82eb-79f5e82582a4')
            .send({
                'number': '551234',
                'limit_on_net': 1,
                'limit_off_net': 1,
                'sent_on_net': 0,
                'sent_off_net': 0,
                'base_day': 5,
                'operator': 'OI'
            })
            .set('Authorization', authorization)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(204)
            .end(function (err, res) {
                if (res.status != 204) {
                    throw new Error('Error to put. ' + err);
                } else {
                    sendSMS.sendSMS({
                        body: {
                            "to": "41998083585",
                            "message": "TestOnLimit",
                            "from": "551234",
                            "operator": "OI"
                        },
                        log: {
                            debug: function () {
                            },
                            info: function () {
                            },
                            error: console.error
                        }
                    }, {
                        send: function (code) {
                            if (code !== 201) {
                                done(new Error());
                            }
                            else {
                                done();
                            }
                        }
                    });
                }
            });

    });
    it('Send sms on ERROR (limit reached)', function (done) {
        sendSMS.sendSMS({
            body: {
                "to": "41998083585",
                "message": "TestError",
                "from": "551234",
                "operator": "OI"
            },
            log: {
                debug: function () {
                },
                info: function () {
                },
                error: console.error
            }
        }, {
            send: function (code) {
                if (code === 402) {
                    done();
                }
                else {
                    done(new Error());
                }
            }
        });
    });
    it('Send sms off OK', function (done) {
        request(app)
            .put('/chips/b2f95b20-86bc-11e8-82eb-79f5e82582a4')
            .send({
                'number': '551234',
                'limit_on_net': 1,
                'limit_off_net': 1,
                'sent_on_net': 0,
                'sent_off_net': 0,
                'base_day': 5,
                'operator': 'OI'
            })
            .set('Authorization', authorization)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(204)
            .end(function (err, res) {
                if (res.status != 204) {
                    throw new Error('Error to put. ' + err);
                } else {
                    sendSMS.sendSMS({
                        body: {
                            "to": "41998083585",
                            "message": "TestOffLimit",
                            "from": "551234",
                            "operator": "NOTvalid"
                        },
                        log: {
                            debug: function () {
                            },
                            info: function () {
                            },
                            error: console.error
                        }
                    }, {
                        send: function (code) {
                            if (code !== 201) {
                                done(new Error());
                            }
                            else {
                                done();
                            }
                        }
                    });
                }
            });

    });
    it('Send sms off ERROR (limit reached)', function (done) {
        sendSMS.sendSMS({
            body: {
                "to": "41998083585",
                "message": "TestError",
                "from": "551234",
                "operator": "NOTvalid"
            },
            log: {
                debug: function () {
                },
                info: function () {
                },
                error: console.error
            }
        }, {
            send: function (code) {
                if (code === 402) {
                    done();
                }
                else {
                    done(new Error());
                }
            }
        });
    });
});

xdescribe('PGMais Broker Route test', function () {
    var routeId;
    var channelId = '0362debe-8ab0-11e8-9a94-a6cf71072f73';
    var authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphcnZpc0B0dW50c2NvcnAuY29tIn0.jhQhM8L3N31hhGfXKfG6m6OuorJVhieciNBGkkKbn5w';
    it('Create route', function (done) {
        request(app).post('/routes')
            .set('Authorization', authorization)
            .send({
                "route": "EBStest123",
                "channels": []
            }).expect(201).end(function (error, res) {
            if (error) {
                done(error);
            }
            else {
                routeId = res.body;
                done();
            }
        });
    });
    it('Update channel route', function (done) {
        request(app).patch('/routes/' + routeId)
            .set('Authorization', authorization)
            .send({
                "channels": [
                    channelId
                ]
            })
            .expect(204)
            .end(function (error) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('Update route', function (done) {
        request(app).patch('/routes/' + routeId)
            .set('Authorization', authorization)
            .send({
                "webhook_url": "http://www.teste1234.com",
                "webhook_radar": "http://www.radar1234.com"
            })
            .expect(204)
            .end(function (error) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
    it('Delete route', function (done) {
        request(app).del('/routes/' + routeId)
            .set('Authorization', authorization)
            .expect(204)
            .end(function (error) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });
});
