const [Sequelize, sequelize] = require('../common/services/database.service')();

const Cdr = sequelize.define('cdr',
    {
        id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
        content: {type: Sequelize.STRING, allowNull: false},
        channel_ref: {type: Sequelize.STRING, allowNull: false},
        host: {type: Sequelize.STRING, allowNull: false},
        status: {type: Sequelize.STRING, defaultValue: '', allowNull: false}
    },
    {
        tableName: 'cdr'
    }
);

Cdr.prototype.processed = function () {
    return this.update({
        status: 'PROCESSED'
    });
};

module.exports = Cdr;
