require('../test/testFixtures').mockLog();

const expect = require('chai').expect;

const messagesDao = require('../app/producer/daos/messages.dao');
const messagesDaoTest = require('./messages.dao');

xdescribe('Route Send SMS', function () {

    let message = {
        ID_MO_MOES: '123123123',
        ID_CAMPANHA_MOES: 8765432,
        ID_EMPRESA_MOES: 13410,
        DS_SMS_MOES: "Mensagem",
        NR_ORIGEM_MOES: "41999999999",
        NR_DESTINO_MOES: "41999999998",
        DT_CADASTRO_MOES: "2018-06-29 15:52:00",
        DT_ENVIO_MOES: "2018-07-31 09:50:55",
        DT_ENTREGA_MOES: null,
        DS_MSGID_MOES: "",
        DS_RETORNO_MOES: null,
        ST_MO_MOES: "TEST",
        NR_MESSAGE_ID_MOES: null,
        ID_LOTE_MOES: 4028829,
        ST_ORIGEM_MOSC: "N",
        TP_HIGIENIZACAO_MOSC: "O",
        CD_STATUS_MOES: null,
        ID_ARQ_CEL_MOES: 7412134463,
        CD_ROTA_MOES: 20000,
        ID_EMPRESA_PAI_MOES: 145,
        ST_TWO_WAY_MOES: "",
        VL_SMS_MOES: null,
        ID_OPERADORA_MOES: 5,
        DS_OBS_MOES: null,
        ID_USUARIO_MOES: null,
        ID_MO_CONCAT_MOES: null,
        CD_GATEWAY_MOES: null,
        ID_PRODUTO_MOES: null,
        DT_ENVIO_REAL_MOES: null
    };

    before('Create database test elements', async () => {
        return await messagesDaoTest.createMessage(message);
    });

    it('Update message', async () => {
        await messagesDao.updateStatus('PENDING', message);
        let msg = await messagesDaoTest.getMessage(message.ID_MO_MOES);
        return expect(msg[0]).to.include({ST_MO_MOES: 'PENDING'});
    });

    after('Cleanup', () => {
        return messagesDaoTest.remove(message.ID_MO_MOES);
    });

});
