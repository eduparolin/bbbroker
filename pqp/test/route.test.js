require('./testFixtures');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const routeService = proxyquire('../app/route/services/route.service',{
    'request-promise': function () {
        return Promise.resolve({
            distribuition_type: "preferential",
            fallback_monthly_limit: 1,
            tags: [
                {
                    tag: "GIGATEC00",
                    driver: "1",
                    max_delay: 2,
                    max_real_delay: 10,
                    priority_order: 97,
                    max_per_hour: 200,
                    max_simultaneous: 200,
                    is_fallback: 0,
                    is_enabled: 1,
                    respect_capacity: 1
                },
                {
                    tag: "OTIMABK00",
                    driver: "1",
                    max_delay: 2,
                    max_real_delay: 10,
                    priority_order: 98,
                    max_per_hour: 200,
                    max_simultaneous: 200,
                    is_fallback: 0,
                    is_enabled: 1,
                    respect_capacity: 1
                }
            ]
        });
    }
});

const routeServiceFail = proxyquire('../app/route/services/route.service',{
    'request-promise': function () {
        return Promise.reject()
    }
});

xdescribe('PGMais Test get routes', function () {
    it('Get routes from routeManager', async () => {
        let route = await routeService.getRoute();
        return expect(route).to.have.property('tags');
    });
    it('Fail Get routes from routeManager', (done) => {
        routeServiceFail.getRoute()
            .then(() => {
                done()
            });
});
    it('Get Tags from Routes', async () => {
        let route = await routeService.getRoute();
        let tag = routeService.getTag(route);
        return expect(tag).to.be.a('object');
    });
});

