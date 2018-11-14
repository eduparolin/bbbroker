const mock = require('mock-require');

const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(sinonChai);
chai.use(chaiAsPromised);

exports.mockLog = () => {
    mock('../modules/common/services/log.service.es6', {
        child: function () {
            return {
                trace: () => {
                },
                info: () => {
                },
                error: () => {
                },
                debug: () => {

                }
            };
        }
    });
};
