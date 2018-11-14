const FreeSwitch = require('./FreeSwitch');
const sinon = require('sinon');

let FreeSwitchMock = sinon.stub(FreeSwitch, 'sendSms').resolves('Mensagem de sucesso');

exports.FreeSwitch = FreeSwitchMock;
