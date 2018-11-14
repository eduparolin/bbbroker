const messageObjectTest = {
    "id": 365056,
    "status": "reserved",
    "payload": "{\"ID_MO_MOES\":5585745192,\"ID_CAMPANHA_MOES\":3123754,\"ID_EMPRESA_MOES\":1326,\"DS_SMS_MOES\":\"Aproveite a oportunidade p/ negociar seu contrato BRADESCO antes de acoes. Ligue 0800 7219292 ou WhatsApp (41) 987023369\",\"NR_ORIGEM_MOES\":\"\",\"NR_DESTINO_MOES\":\"21976756865\",\"DT_CADASTRO_MOES\":\"2018-07-31 10:27:07\",\"DT_ENVIO_MOES\":\"2018-07-31 12:00:06\",\"DT_ENTREGA_MOES\":null,\"DS_MSGID_MOES\":\"\",\"DS_RETORNO_MOES\":null,\"ST_MO_MOES\":\"RESERVATION-iyUJMMrc\",\"NR_MESSAGE_ID_MOES\":null,\"ID_LOTE_MOES\":4237181,\"ST_ORIGEM_MOSC\":\"N\",\"TP_HIGIENIZACAO_MOSC\":\"O\",\"CD_STATUS_MOES\":null,\"ID_ARQ_CEL_MOES\":7698563015,\"CD_ROTA_MOES\":20000,\"ID_EMPRESA_PAI_MOES\":145,\"ST_TWO_WAY_MOES\":\"\",\"VL_SMS_MOES\":null,\"ID_OPERADORA_MOES\":4,\"DS_OBS_MOES\":null,\"ID_USUARIO_MOES\":null,\"ID_MO_CONCAT_MOES\":null,\"CD_GATEWAY_MOES\":null,\"ID_PRODUTO_MOES\":null,\"DT_ENVIO_REAL_MOES\":null}",
    "priority": 0,
    "timeToRun": "60",
    "tag": "OTIMABK00",
    "reservationCounter": 2
};

exports.reserveMessageFullReservation = () => {
    messageObjectTest.tag = 'OTIMABK00';
    messageObjectTest.reservationCounter = 21;
    return Promise.resolve(messageObjectTest);
};

exports.reserveMessage = () => {
    messageObjectTest.tag = 'OTIMABK00';
    messageObjectTest.reservationCounter = 2;
    return Promise.resolve(messageObjectTest);
};

exports.reserveMessageSent = () => {
    messageObjectTest.tag = 'SENT';
    messageObjectTest.reservationCounter = 2;
    return Promise.resolve(messageObjectTest);
};

exports.reserveMessageDelivered = () => {
    messageObjectTest.tag = 'DELIVERED';
    messageObjectTest.reservationCounter = 2;
    return Promise.resolve(messageObjectTest);
};

exports.buryMessage = () => {
    return Promise.resolve();
};

exports.deleteMessage = () => {
    return Promise.resolve();
};

exports.releaseMessage = () => {
    return Promise.resolve('releaseOk');
};

exports.buryMessageFail = () => {
    return Promise.reject('buryFail');
};

exports.reserveMessageFail = () => {
    return Promise.reject('reserveFail');
};

exports.deleteMessageFail = () => {
    return Promise.reject('delFail');
};

exports.releaseMessageFail = () => {
    return Promise.reject('releaseFail');
};