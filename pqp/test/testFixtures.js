const mock = require('mock-require');

const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(sinonChai);
chai.use(chaiAsPromised);

exports.mockLog = () => {
    mock('../app/common/services/log.service.js', {
        trace: () => {
        },
        debug: () => {
        },
        info: () => {
        },
        error: () => {
        },
        child: function () {
            return {
                trace: () => {
                },
                debug: () => {
                },
                info: () => {
                },
                error: () => {
                }
            };
        }
    });
};
