const rp = require('request-promise');
const config = require('../../config/env.config');
const logger = require('../../common/services/log.service');

let getRoutes = {
    method: 'GET',
    url: config.routeManager.url + config.routeManager.route,
    headers: {
        'authorization': config.routeManager.authorization
    },
    json: true
};

exports.getRoute = () => {
    logger.debug({getRouteRequest: getRoutes}, "getRouteRequest");
    return rp(getRoutes)
        .then((route) => {
            logger.debug({getRouteResponse: route}, "getRouteResponse");
            return route;
        })
        .catch((err) => {
            logger.error({getRouteError: err}, "getRouteError");
            return Promise.resolve();
        });
};

exports.getTag = (route) => {
    let previousTag;
    let highestPriorityTag;
    for(let tag of route.tags) {
        if((previousTag && tag.priority_order > previousTag.priority_order) || route.tags.length === 1){
            highestPriorityTag = tag;
        }
        previousTag = tag;
    }
    return highestPriorityTag;
};

exports.getNextTag = (route, currentTag) => {
    let nextTag = currentTag;
    for(let tag of route.tags) {
        if(currentTag.priority_order - 1 === tag.priority_order){
            nextTag = tag;
        }
    }
    return nextTag;
};
