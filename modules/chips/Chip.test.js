const Chip = require('./Chip');
const Route = require('../routes/Route');

xdescribe('Chip Class', function () {
    /*this.timeout(10000);
    it('Should list chips', function (done) {
        Chip.listChips()
            .then((res)=>{
                done('result',res);
            },(error) => {
                done(error);
            });
    });*/
    it('Should return list of chip with routes', function (done) {
        Chip.belongsTo(Route, {foreignKey: 'route_id', targetKey: 'id'});
        Route.hasMany(Chip, {foreignKey: 'route_id', targetKey: 'id'});
        Chip.getChipByChannelId('B00C000')
           .then((res)=>{
               done();
           },(error) => {
               done(error);
           });
    });
});
