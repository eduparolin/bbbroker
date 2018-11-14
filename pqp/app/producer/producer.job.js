const producerController = require('./producer.controller');
const queueService = require('./services/queue.service');
const routeService = require('../route/services/route.service');

let route;

async function produceMessageJob(runCount) {
    runCount++;
    if(runCount === 100 || !route){
        route = await routeService.getRoute();
        runCount = 0;
    }
    if(route) {
        let tag = routeService.getTag(route);
        let nextTag = routeService.getNextTag(route, tag);
        if (tag) {
            let [timeout, parsedMessages, parsedFilterMessages] = await producerController.produceMessages(tag, nextTag, route.route_number);
            if (parsedMessages && parsedMessages.length > 0 && parsedFilterMessages && parsedFilterMessages.length > 0) {
                queueService.startQueuing(parsedMessages, parsedFilterMessages);
            }

            setTimeout(produceMessageJob.bind(null, runCount), timeout);
        }
    } else {
        setTimeout(produceMessageJob.bind(null, runCount), 100);
    }
}

exports.produceMessageJob = produceMessageJob;