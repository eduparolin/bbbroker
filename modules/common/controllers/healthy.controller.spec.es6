let assert = require('assert');
let healthyController = require('./healthy.controller.es6');
describe('healthy controller', function() {
    describe('example', function() {
        it('should do something', function() {
            assert.equal(undefined, healthyController.check({}, {}));
        });
    });
});