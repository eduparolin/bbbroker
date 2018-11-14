const moDb = require('./app/common/services/database.service');
const filterDb = require('./app/common/services/filter.database.service');
const logger = require('./app/common/services/log.service');

async function compare(date) {
    let moData = await getId(date);
    for (let d of moData) {

    }

    if (data[0]) {
        checkId(data[0].ID_MO_MOES)
            .then((rData) => {
                if (!rData[0]) {
                    console.log('>>>>>>>>>>>>ID', data[0].ID_MO_MOES)
                }
            });
        setTimeout(compare.bind(null, data[0].DT_ENVIO_MOES));
    }
}

function getFirstF() {
    let query = 'select MIN(created_at) as min from messages where created_at BETWEEN \'2018-11-14\' AND \'2018-11-15\' ORDER BY created_at ASC LIMIT 1;';
    let params = [];
    return filterDb.runQuery(query, params, logger, 'getFirst');
}

function getFirst() {
    let query = 'select MIN(DT_ENVIO_MOES) as min from MO_ESMS where DT_ENVIO_MOES BETWEEN \'2018-11-14\' AND \'2018-11-15\' AND CD_ROTA_MOES = 20000 ORDER BY DT_ENVIO_MOES ASC LIMIT 1;';
    let params = [];
    return moDb.runQuery(query, params, logger, 'getFirst');
}

function getIdFilter(date, counter) {
    let query = 'select id_mo, created_at from messages where created_at BETWEEN \'2018-11-14\' AND \'2018-11-15\' and created_at > ? ORDER BY created_at ASC LIMIT 1000;';
    let params = [date];
    return filterDb.runQuery(query, params, logger, 'getIdFilter')
        .then(resp => {
            for(let r of resp) {
                //console.log(r);
                checkId(r.id_mo)
                    .then(moR => {
                        if(!moR[0]) {
                            console.log('>>>>OOOPS', r.id_mo);
                        }
                    })
                    .catch(console.log)
            }
if(resp[0]){
console.log(counter);            
console.log(resp[resp.length-1].created_at);
            setTimeout(getIdFilter.bind(null, resp[resp.length-1].created_at, ++counter));
}        
})
}

function checkId(id) {
    let query = 'select ID_MO_MOES, ST_MO_MOES, CD_ROTA_MOES, DT_ENVIO_MOES FROM esms.MO_ESMS WHERE ID_MO_MOES = ?';
    let params = [id];
    return moDb.runQuery(query, params, logger, 'checkId');
}

getFirstF()
    .then(resp => {
        console.log(resp[0].min);
        getIdFilter(resp[0].min, 0);
    })
    .catch(console.log);