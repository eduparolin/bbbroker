const moDb = require('./app/common/services/database.service');
const filterDb = require('./app/common/services/filter.database.service');
const logger = require('./app/common/services/log.service');

function compare(date) {
    let query = 'select ST_MO_MOES, CD_ROTA_MOES, DT_ENVIO_MOES, ID_MO_MOES from MO_ESMS where DT_ENVIO_MOES BETWEEN \'2018-11-14\' AND \'2018-11-15\' AND CD_ROTA_MOES = 20000 and DT_ENVIO_MOES > ? ORDER BY DT_ENVIO_MOES ASC LIMIT 1;';
    let params = [date];
    moDb.runQuery(query, params, logger, 'compare')
        .then(data => {
            setTimeout(compare.bind(null, data.DT_ENVIO_MOES));
        })
}

function getFirst() {
    let query = 'select MIN(DT_ENVIO_MOES) as min from MO_ESMS where DT_ENVIO_MOES BETWEEN \'2018-11-14\' AND \'2018-11-15\' AND CD_ROTA_MOES = 20000 ORDER BY DT_ENVIO_MOES ASC LIMIT 1;';
    let params = [];
    return moDb.runQuery(query, params, logger, compare);
}

getFirst()
.then(resp => {
    compare(resp.min);
})
.catch(console.log);