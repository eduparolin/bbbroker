const chronographjs = require('chronographjs');

// If you are seeing 'log-middleware' in your logs is because you forgot
// to override the logging module. Go now and DO IT.
function generateTimer(req, res, next) {
    req.timer = new chronographjs.getTimer();
    req.timersTags = {};
    req.timerList = [];

    req.startTime = (id, tags) => {
        req.timerList.push(id);
        if (tags) {
            let tagArray = tags.split(',');
            for (let tag of tagArray) {
                tag = tag.trim();
                if (tag) {
                    req.timersTags[tag] = true;
                }
            }
        }
        req.timer.start(id, tags);
    };

    req.stopTime = (id) => {
        if (req.timerList.indexOf(id) >= 0) {
            req.timer.stop(id);
        }
    };

    next();
}

module.exports = generateTimer;