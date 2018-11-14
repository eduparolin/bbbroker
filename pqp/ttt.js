const moDb = require('./app/common/services/database.service');
const filterDb = require('./app/common/services/filter.database.service');
const logger = require('./app/common/services/log.service');

let campaings = [];

function getFirstF() {
    let query = 'select MIN(created_at) as min from messages where created_at BETWEEN \'2018-11-14\' AND \'2018-11-15\' ORDER BY created_at ASC LIMIT 1;';
    let params = [];
    return filterDb.runQuery(query, params, logger, 'getFirst');
}

function getIdFilter(date, counter) {
    let query = 'select id_mo, created_at, route from messages where created_at BETWEEN \'2018-11-14\' AND \'2018-11-15\' and created_at > ? ORDER BY created_at ASC LIMIT 1000;';
    let params = [date];
    return filterDb.runQuery(query, params, logger, 'getIdFilter')
        .then(resp => {
            let promises = [];
            for (let r of resp) {
                promises.push(checkId(r.id_mo)
                    .then(moR => {
                        if (String(moR[0].CD_ROTA_MOES) !== String(r.route)) {
                            let strC = String(moR[0].ID_CAMPANHA_MOES);
                            if(campaings[strC]) {
                                campaings[strC].qty = campaings[strC].qty + 1
                            } else {
                                campaings[strC] = {
                                    qty: 1,
                                    rota: moR[0].CD_ROTA_MOES
                                };
                            }
                            console.log('>>>>OOOPS', r.id_mo, moR[0].CD_ROTA_MOES);
                        }
                        // if (!moR[0]) {
                        //     console.log('>>>>OOOPS', r.id_mo);
                        // } else {
                        //     console.log('AAAAAA: ', moR[0].CD_ROTA_MOES, 'BBBBBB: ', r.route);
                        // }
                        return Promise.resolve();
                    }))
            }
            Promise.all(promises)
                .then(_ => {
                    console.log(campaings);
                    if (resp[0]) {
                        console.log(counter);
                        console.log(resp[resp.length - 1].created_at);
                        setTimeout(getIdFilter.bind(null, resp[resp.length - 1].created_at, ++counter));
                    } else {
                        console.log(campaings);
                    }
                });
        })
}

function checkId(id) {
    let query = 'select ID_MO_MOES, ST_MO_MOES, CD_ROTA_MOES, DT_ENVIO_MOES, ID_CAMPANHA_MOES FROM esms.MO_ESMS WHERE ID_MO_MOES = ?';
    let params = [id];
    return moDb.runQuery(query, params, logger, 'checkId');
}

getFirstF()
    .then(resp => {
        console.log(resp[0].min);
        getIdFilter(resp[0].min, 0);
    })
    .catch(console.log);