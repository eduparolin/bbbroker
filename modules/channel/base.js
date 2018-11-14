const log = require('../../modules/common/services/log.service.es6');

function log1(str) {
    log.child({test: 'test1'}).debug({sequelizeLog: str}, 'sequelize log');
}

function log2(str) {
    log.child({test: 'test2'}).debug({sequelizeLog: str}, 'sequelize log');
}

function logger(){
    console.log(arguments);
}

const Sequelize = require('sequelize');
const sequelize = new Sequelize('pgmais_broker_dev', 'pgmais_broker_admin', 'PgMais@018', {
    host: 'database.service.cwb1.tunts.net',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: log1
});

module.exports = sequelize;