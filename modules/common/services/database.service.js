const config = require('../../../config/env.config.es6');
const log = require('./log.service.es6').child({module: 'Database'});

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: 'mysql',
    dialectOptions: {
        flags: '-FOUND_ROWS'
    },
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: function (sequelizeLog) {
        log.trace({sequelizeLog}, 'Sequelize');
    },
    define: {
        underscored: true
    },retry: {
        max: 5
    }
});

module.exports = function (init = false) {
    if (init) {
        sequelize
            .authenticate()
            .then(() => {
                log.info('Connection has been established successfully.');
            })
            .catch(err => {
                log.error('Unable to connect to the database:', err);
                process.exit(1);
            });
    }

    return [Sequelize, sequelize];
};
