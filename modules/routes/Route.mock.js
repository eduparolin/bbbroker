const sinon = require('sinon');
const Route = require('./RouteSequelize');

let RouteMock = sinon.stub(Route, 'findOne').callsFake(() => {

    let route = new Route();
    let instance = Object.assign(route,
        {
            'id': '123e4567-e89b-12d3-a456-426655440000',
            'name': 'MockRoute',
            'prefix': '01234',
        }
    );
    return Promise.resolve(
        instance
    );
});

module.exports = RouteMock;
