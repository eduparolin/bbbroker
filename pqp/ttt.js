const moDb = require('./app/common/services/database.service');
const filterDb = require('./app/common/services/filter.database.service');
const logger = require('./app/common/services/log.service');

function compare(date, count) {
    let query = 'select ST_MO_MOES, CD_ROTA_MOES, DT_ENVIO_MOES, ID_MO_MOES from MO_ESMS where DT_ENVIO_MOES BETWEEN \'2018-11-14\' AND \'2018-11-15\' AND CD_ROTA_MOES = 20000 and DT_ENVIO_MOES > ? ORDER BY DT_ENVIO_MOES ASC LIMIT 1;';
    let params = [date];
    moDb.runQuery(query, params, logger, 'compare')
        .then(data => {
	    console.log(count, data[0]);
            if(data[0]){
               setTimeout(compare.bind(null, data[0].DT_ENVIO_MOES, ++count));
            }
        })
}

function getFirst() {
    let query = 'select MIN(DT_ENVIO_MOES) as min from MO_ESMS where DT_ENVIO_MOES BETWEEN \'2018-11-14\' AND \'2018-11-15\' AND CD_ROTA_MOES = 20000 ORDER BY DT_ENVIO_MOES ASC LIMIT 1;';
    let params = [];
    return moDb.runQuery(query, params, logger, compare);
}

getFirst()
.then(resp => {
    console.log(resp[0].min)
    compare(resp[0].min, 0);
})
.catch(console.log);