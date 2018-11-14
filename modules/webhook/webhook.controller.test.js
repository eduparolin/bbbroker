require('../../tests/testFixtures');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const app = require('../app.es6');
const request = require('supertest');
const sinon = require('sinon');

const webhook = proxyquire('./webhook.controller.es6', {
    '../mickey/services/mickey.service.es6': {
        setDelivered: function () {
            return Promise.resolve()
        }
    }
});

const webhookFail = proxyquire('./webhook.controller.es6', {
    '../mickey/services/mickey.service.es6': {
        setDelivered: function () {
            return Promise.reject()
        }
    }
});

xdescribe(' Webhook Test', function () {
    it('handleMickeySMS', async () => {
        let res = await webhook.handleMickeySMS({sms_text: 'test:test'}, {
            debug: function () {
            }
        });
        return expect(res).to.be.undefined;
    });
    it('Fail handleMickeySMS', () => {
        return expect(webhookFail.handleMickeySMS({sms_text: 'test:test'}, {
            debug: function () {
            }
        })).to.eventually.be.rejected;
    });
});

xdescribe('Webhook routes', function () {
    let SmsStub;
    let webhookServiceStub;
    let mickeyServiceStub;
    let webhookDao;

    beforeEach(function () {
        SmsStub = sinon.stub(require('../sms/Sms'), 'updateSmsByDate').callsFake(() => {
            return Promise.resolve()
        });
        webhookServiceStub = sinon.stub(require('../webhook/services/webhook.service'), 'sendWebhookSMS').callsFake(() => {
            return Promise.resolve()
        });
        mickeyServiceStub = sinon.stub(require('../mickey/services/mickey.service.es6'), 'setDelivered').callsFake(() => {
            return Promise.resolve()
        });
        webhookDao = sinon.stub(require('../webhook/webhook.daos/webhook.dao.es6'), 'saveSmsRadar').callsFake(() => {
            return Promise.resolve()
        });
    });

    afterEach(function () {
        webhookServiceStub.restore(); // Unwraps the spy
        SmsStub.restore();
        mickeyServiceStub.restore();
        webhookDao.restore();
    });

    xit('messageReceived - Post /cdr - with destination', (done) => {
        request(app)
            .post('/cdr')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphcnZpc0B0dW50c2NvcnAuY29tIn0.jhQhM8L3N31hhGfXKfG6m6OuorJVhieciNBGkkKbn5w')
            .set('Content-Type', 'text/xml')
            .send('<?xml version="1.0"?>\n' +
                '<cdr core-uuid="fe239a9b-a067-45d8-95d8-cfa03844e140" switchname="fs1.local.tunts.net.tnt.local">\n' +
                '  <channel_data>\n' +
                '    <state>CS_REPORTING</state>\n' +
                '    <direction>inbound</direction>\n' +
                '    <state_number>11</state_number>\n' +
                '    <flags>0=1;38=1;40=1</flags>\n' +
                '    <caps></caps>\n' +
                '  </channel_data>\n' +
                '  <call-stats></call-stats>\n' +
                '  <variables>\n' +
                '    <direction>inbound</direction>\n' +
                '    <uuid>f3c3e643-2020-4ae5-b0ac-69ff678117f9</uuid>\n' +
                '    <session_id>146</session_id>\n' +
                '    <channel_name>Khomp_SMS/0/11</channel_name>\n' +
                '    <KSmsType>message</KSmsType>\n' +
                '    <KSmsFrom>%2B5541996682499</KSmsFrom>\n' +
                '    <KSmsDate>18/08/30,16%3A55%3A40-12</KSmsDate>\n' +
                '    <KSmsSize>41</KSmsSize>\n' +
                '    <KSmsMode>gsm0338</KSmsMode>\n' +
                '    <KSmsBody>Message for +5541996682499, with identification 180831104542 has been delivered on 2018-08-31 at 10:45:44.</KSmsBody>\n' +
                '    <DP_MATCH>s</DP_MATCH>\n' +
                '    <DP_MATCH>s</DP_MATCH>\n' +
                '    <call_uuid>f3c3e643-2020-4ae5-b0ac-69ff678117f9</call_uuid>\n' +
                '    <host>10.41.1.39</host>\n' +
                '    <export_vars>host</export_vars>\n' +
                '    <KSmsDelivered>no</KSmsDelivered>\n' +
                '    <KSmsErrorCode>38</KSmsErrorCode>\n' +
                '    <KSmsErrorName>Network%20out%20of%20order</KSmsErrorName>\n' +
                '    <current_application_data>NORMAL_CLEARING</current_application_data>\n' +
                '    <current_application>hangup</current_application>\n' +
                '    <hangup_cause>NORMAL_CLEARING</hangup_cause>\n' +
                '    <hangup_cause_q850>16</hangup_cause_q850>\n' +
                '    <digits_dialed>none</digits_dialed>\n' +
                '    <start_stamp>2018-08-30%2016%3A55%3A50</start_stamp>\n' +
                '    <profile_start_stamp>2018-08-30%2016%3A55%3A50</profile_start_stamp>\n' +
                '    <end_stamp>2018-08-30%2016%3A55%3A53</end_stamp>\n' +
                '    <start_epoch>1535658950</start_epoch>\n' +
                '    <start_uepoch>1535658950980275</start_uepoch>\n' +
                '    <profile_start_epoch>1535658950</profile_start_epoch>\n' +
                '    <profile_start_uepoch>1535658950980275</profile_start_uepoch>\n' +
                '    <answer_epoch>0</answer_epoch>\n' +
                '    <answer_uepoch>0</answer_uepoch>\n' +
                '    <bridge_epoch>0</bridge_epoch>\n' +
                '    <bridge_uepoch>0</bridge_uepoch>\n' +
                '    <last_hold_epoch>0</last_hold_epoch>\n' +
                '    <last_hold_uepoch>0</last_hold_uepoch>\n' +
                '    <hold_accum_seconds>0</hold_accum_seconds>\n' +
                '    <hold_accum_usec>0</hold_accum_usec>\n' +
                '    <hold_accum_ms>0</hold_accum_ms>\n' +
                '    <resurrect_epoch>0</resurrect_epoch>\n' +
                '    <resurrect_uepoch>0</resurrect_uepoch>\n' +
                '    <progress_epoch>0</progress_epoch>\n' +
                '    <progress_uepoch>0</progress_uepoch>\n' +
                '    <progress_media_epoch>0</progress_media_epoch>\n' +
                '    <progress_media_uepoch>0</progress_media_uepoch>\n' +
                '    <end_epoch>1535658953</end_epoch>\n' +
                '    <end_uepoch>1535658953980273</end_uepoch>\n' +
                '    <last_app>hangup</last_app>\n' +
                '    <last_arg>NORMAL_CLEARING</last_arg>\n' +
                '    <caller_id>%2B5541996682499</caller_id>\n' +
                '    <duration>3</duration>\n' +
                '    <billsec>0</billsec>\n' +
                '    <progresssec>0</progresssec>\n' +
                '    <answersec>0</answersec>\n' +
                '    <waitsec>0</waitsec>\n' +
                '    <progress_mediasec>0</progress_mediasec>\n' +
                '    <flow_billsec>0</flow_billsec>\n' +
                '    <mduration>3000</mduration>\n' +
                '    <billmsec>0</billmsec>\n' +
                '    <progressmsec>0</progressmsec>\n' +
                '    <answermsec>0</answermsec>\n' +
                '    <waitmsec>0</waitmsec>\n' +
                '    <progress_mediamsec>0</progress_mediamsec>\n' +
                '    <flow_billmsec>0</flow_billmsec>\n' +
                '    <uduration>2999998</uduration>\n' +
                '    <billusec>0</billusec>\n' +
                '    <progressusec>0</progressusec>\n' +
                '    <answerusec>0</answerusec>\n' +
                '    <waitusec>0</waitusec>\n' +
                '    <progress_mediausec>0</progress_mediausec>\n' +
                '    <flow_billusec>0</flow_billusec>\n' +
                '  </variables>\n' +
                '  <app_log>\n' +
                '    <application app_name="export" app_data="host=10.41.1.39" app_stamp="1535658950990475"></application>\n' +
                '    <application app_name="log" app_data="DEBUG  Sending SMS ..." app_stamp="1535658950990595"></application>\n' +
                '    <application app_name="KSendSMS" app_data="b0|99887766|Test message" app_stamp="1535658950990709"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Sent? " app_stamp="1535658953992063"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Sent? no" app_stamp="1535658953992202"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Code: 38" app_stamp="1535658953992360"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Desc: Network out of order" app_stamp="1535658953992475"></application>\n' +
                '    <application app_name="hangup" app_data="NORMAL_CLEARING" app_stamp="1535658953992586"></application>\n' +
                '  </app_log>\n' +
                '  <callflow dialplan="XML" unique-id="9a7f9b42-e049-447e-8b11-0c230ade9636" profile_index="1">\n' +
                '    <extension name="public_extensions" number="s">\n' +
                '      <application app_name="export" app_data="host=10.41.1.39"></application>\n' +
                '      <application app_name="log" app_data="DEBUG  Sending SMS ..."></application>\n' +
                '      <application app_name="KSendSMS" app_data="b0|99887766|Test message"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Sent? ${KSmsSerial}"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Sent? ${KSmsDelivered}"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Code: ${KSmsErrorCode}"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Desc: ${KSmsErrorName}"></application>\n' +
                '      <application app_name="hangup" app_data="NORMAL_CLEARING"></application>\n' +
                '    </extension>\n' +
                '    <caller_profile>\n' +
                '      <username>Khomp_SMS</username>\n' +
                '      <dialplan>XML</dialplan>\n' +
                '      <caller_id_name></caller_id_name>\n' +
                '      <caller_id_number>+5541996682499</caller_id_number>\n' +
                '      <callee_id_name></callee_id_name>\n' +
                '      <callee_id_number></callee_id_number>\n' +
                '      <ani>+5541996682499</ani>\n' +
                '      <aniii></aniii>\n' +
                '      <network_addr></network_addr>\n' +
                '      <rdnis></rdnis>\n' +
                '      <destination_number>s</destination_number>\n' +
                '      <uuid>f3c3e643-2020-4ae5-b0ac-69ff678117f9</uuid>\n' +
                '      <source>mod_khomp</source>\n' +
                '      <context>khomp-sms</context>\n' +
                '      <chan_name>Khomp_SMS/0/12</chan_name>\n' +
                '    </caller_profile>\n' +
                '    <times>\n' +
                '      <created_time>1535658950980275</created_time>\n' +
                '      <profile_created_time>1535658950980275</profile_created_time>\n' +
                '      <progress_time>0</progress_time>\n' +
                '      <progress_media_time>0</progress_media_time>\n' +
                '      <answered_time>0</answered_time>\n' +
                '      <bridged_time>0</bridged_time>\n' +
                '      <last_hold_time>0</last_hold_time>\n' +
                '      <hold_accum_time>0</hold_accum_time>\n' +
                '      <hangup_time>1535658953980273</hangup_time>\n' +
                '      <resurrect_time>0</resurrect_time>\n' +
                '      <transfer_time>0</transfer_time>\n' +
                '    </times>\n' +
                '  </callflow>\n' +
                '</cdr>')
            .expect(200)
            .end(function (err, res) {
                if (res.status === 200) {
                    done();
                } else if(res.status === 500){
                    throw new Error('ERROR 500');
                }
            });
    });

    it('messageReceived - Post /cdr - without destination', (done) => {
        request(app)
            .post('/cdr')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphcnZpc0B0dW50c2NvcnAuY29tIn0.jhQhM8L3N31hhGfXKfG6m6OuorJVhieciNBGkkKbn5w')
            .set('Content-Type', 'text/xml')
            .send('<?xml version="1.0"?>\n' +
                '<cdr core-uuid="fe239a9b-a067-45d8-95d8-cfa03844e140" switchname="fs1.local.tunts.net.tnt.local">\n' +
                '  <channel_data>\n' +
                '    <state>CS_REPORTING</state>\n' +
                '    <direction>inbound</direction>\n' +
                '    <state_number>11</state_number>\n' +
                '    <flags>0=1;38=1;40=1</flags>\n' +
                '    <caps></caps>\n' +
                '  </channel_data>\n' +
                '  <call-stats></call-stats>\n' +
                '  <variables>\n' +
                '    <direction>inbound</direction>\n' +
                '    <uuid>f3c3e643-2020-4ae5-b0ac-69ff678117f9</uuid>\n' +
                '    <session_id>146</session_id>\n' +
                '    <channel_name>Khomp_SMS/0/11</channel_name>\n' +
                '    <KSmsType>message</KSmsType>\n' +
                '    <KSmsFrom>%2B5541996682499</KSmsFrom>\n' +
                '    <KSmsDate>18/08/30,16%3A55%3A40-12</KSmsDate>\n' +
                '    <KSmsSize>41</KSmsSize>\n' +
                '    <KSmsMode>gsm0338</KSmsMode>\n' +
                '    <KSmsBody>mkey:585019d0-abcd-11e8-80db-c789041a8fb7</KSmsBody>\n' +
                '    <DP_MATCH>s</DP_MATCH>\n' +
                '    <DP_MATCH>s</DP_MATCH>\n' +
                '    <call_uuid>f3c3e643-2020-4ae5-b0ac-69ff678117f9</call_uuid>\n' +
                '    <host>10.41.1.39</host>\n' +
                '    <export_vars>host</export_vars>\n' +
                '    <KSmsDelivered>no</KSmsDelivered>\n' +
                '    <KSmsErrorCode>38</KSmsErrorCode>\n' +
                '    <KSmsErrorName>Network%20out%20of%20order</KSmsErrorName>\n' +
                '    <current_application_data>NORMAL_CLEARING</current_application_data>\n' +
                '    <current_application>hangup</current_application>\n' +
                '    <hangup_cause>NORMAL_CLEARING</hangup_cause>\n' +
                '    <hangup_cause_q850>16</hangup_cause_q850>\n' +
                '    <digits_dialed>none</digits_dialed>\n' +
                '    <start_stamp>2018-08-30%2016%3A55%3A50</start_stamp>\n' +
                '    <profile_start_stamp>2018-08-30%2016%3A55%3A50</profile_start_stamp>\n' +
                '    <end_stamp>2018-08-30%2016%3A55%3A53</end_stamp>\n' +
                '    <start_epoch>1535658950</start_epoch>\n' +
                '    <start_uepoch>1535658950980275</start_uepoch>\n' +
                '    <profile_start_epoch>1535658950</profile_start_epoch>\n' +
                '    <profile_start_uepoch>1535658950980275</profile_start_uepoch>\n' +
                '    <answer_epoch>0</answer_epoch>\n' +
                '    <answer_uepoch>0</answer_uepoch>\n' +
                '    <bridge_epoch>0</bridge_epoch>\n' +
                '    <bridge_uepoch>0</bridge_uepoch>\n' +
                '    <last_hold_epoch>0</last_hold_epoch>\n' +
                '    <last_hold_uepoch>0</last_hold_uepoch>\n' +
                '    <hold_accum_seconds>0</hold_accum_seconds>\n' +
                '    <hold_accum_usec>0</hold_accum_usec>\n' +
                '    <hold_accum_ms>0</hold_accum_ms>\n' +
                '    <resurrect_epoch>0</resurrect_epoch>\n' +
                '    <resurrect_uepoch>0</resurrect_uepoch>\n' +
                '    <progress_epoch>0</progress_epoch>\n' +
                '    <progress_uepoch>0</progress_uepoch>\n' +
                '    <progress_media_epoch>0</progress_media_epoch>\n' +
                '    <progress_media_uepoch>0</progress_media_uepoch>\n' +
                '    <end_epoch>1535658953</end_epoch>\n' +
                '    <end_uepoch>1535658953980273</end_uepoch>\n' +
                '    <last_app>hangup</last_app>\n' +
                '    <last_arg>NORMAL_CLEARING</last_arg>\n' +
                '    <caller_id>%2B5541996682499</caller_id>\n' +
                '    <duration>3</duration>\n' +
                '    <billsec>0</billsec>\n' +
                '    <progresssec>0</progresssec>\n' +
                '    <answersec>0</answersec>\n' +
                '    <waitsec>0</waitsec>\n' +
                '    <progress_mediasec>0</progress_mediasec>\n' +
                '    <flow_billsec>0</flow_billsec>\n' +
                '    <mduration>3000</mduration>\n' +
                '    <billmsec>0</billmsec>\n' +
                '    <progressmsec>0</progressmsec>\n' +
                '    <answermsec>0</answermsec>\n' +
                '    <waitmsec>0</waitmsec>\n' +
                '    <progress_mediamsec>0</progress_mediamsec>\n' +
                '    <flow_billmsec>0</flow_billmsec>\n' +
                '    <uduration>2999998</uduration>\n' +
                '    <billusec>0</billusec>\n' +
                '    <progressusec>0</progressusec>\n' +
                '    <answerusec>0</answerusec>\n' +
                '    <waitusec>0</waitusec>\n' +
                '    <progress_mediausec>0</progress_mediausec>\n' +
                '    <flow_billusec>0</flow_billusec>\n' +
                '  </variables>\n' +
                '  <app_log>\n' +
                '    <application app_name="export" app_data="host=10.41.1.39" app_stamp="1535658950990475"></application>\n' +
                '    <application app_name="log" app_data="DEBUG  Sending SMS ..." app_stamp="1535658950990595"></application>\n' +
                '    <application app_name="KSendSMS" app_data="b0|99887766|Test message" app_stamp="1535658950990709"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Sent? " app_stamp="1535658953992063"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Sent? no" app_stamp="1535658953992202"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Code: 38" app_stamp="1535658953992360"></application>\n' +
                '    <application app_name="log" app_data="DEBUG Desc: Network out of order" app_stamp="1535658953992475"></application>\n' +
                '    <application app_name="hangup" app_data="NORMAL_CLEARING" app_stamp="1535658953992586"></application>\n' +
                '  </app_log>\n' +
                '  <callflow dialplan="XML" unique-id="9a7f9b42-e049-447e-8b11-0c230ade9636" profile_index="1">\n' +
                '    <extension name="public_extensions" number="s">\n' +
                '      <application app_name="export" app_data="host=10.41.1.39"></application>\n' +
                '      <application app_name="log" app_data="DEBUG  Sending SMS ..."></application>\n' +
                '      <application app_name="KSendSMS" app_data="b0|99887766|Test message"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Sent? ${KSmsSerial}"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Sent? ${KSmsDelivered}"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Code: ${KSmsErrorCode}"></application>\n' +
                '      <application app_name="log" app_data="DEBUG Desc: ${KSmsErrorName}"></application>\n' +
                '      <application app_name="hangup" app_data="NORMAL_CLEARING"></application>\n' +
                '    </extension>\n' +
                '    <caller_profile>\n' +
                '      <username>Khomp_SMS</username>\n' +
                '      <dialplan>XML</dialplan>\n' +
                '      <caller_id_name></caller_id_name>\n' +
                '      <caller_id_number>+5541996682499</caller_id_number>\n' +
                '      <callee_id_name></callee_id_name>\n' +
                '      <callee_id_number></callee_id_number>\n' +
                '      <ani>+5541996682499</ani>\n' +
                '      <aniii></aniii>\n' +
                '      <network_addr></network_addr>\n' +
                '      <rdnis></rdnis>\n' +
                '      <destination_number>s</destination_number>\n' +
                '      <uuid>f3c3e643-2020-4ae5-b0ac-69ff678117f9</uuid>\n' +
                '      <source>mod_khomp</source>\n' +
                '      <context>khomp-sms</context>\n' +
                '      <chan_name>Khomp_SMS/0/12</chan_name>\n' +
                '    </caller_profile>\n' +
                '    <times>\n' +
                '      <created_time>1535658950980275</created_time>\n' +
                '      <profile_created_time>1535658950980275</profile_created_time>\n' +
                '      <progress_time>0</progress_time>\n' +
                '      <progress_media_time>0</progress_media_time>\n' +
                '      <answered_time>0</answered_time>\n' +
                '      <bridged_time>0</bridged_time>\n' +
                '      <last_hold_time>0</last_hold_time>\n' +
                '      <hold_accum_time>0</hold_accum_time>\n' +
                '      <hangup_time>1535658953980273</hangup_time>\n' +
                '      <resurrect_time>0</resurrect_time>\n' +
                '      <transfer_time>0</transfer_time>\n' +
                '    </times>\n' +
                '  </callflow>\n' +
                '</cdr>')
            .expect(200)
            .end(function (err, res) {
                if (res.status === 200) {
                    done();
                } else if(res.status === 500){
                    throw new Error('ERROR 500');
                }
            });
    });

});
