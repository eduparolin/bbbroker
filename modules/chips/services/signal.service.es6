const esl = require('modesl');

function getSignalInfo(logger) {
    return new Promise(function (resolve, reject) {
        let connected = false;
        let conn = new esl.Connection('10.41.1.39', 8021, 'ClueCon', function () {
            conn.api('khomp show channels', function (res) {
                connected = true;
                let array = res.getBody().split('\n');
                let json = [];
                for (let string of array) {
                    let matches = string.match(/(?:.*)(\d{2},\d{3})(?:.*\|[ a-zA-Z]*\|[ a-zA-Z]*\| )(SIM error|[a-zA-Z]*)(?:[ a-zA-Z(.),]* [a-zA-Z :]*)(\d*)(?: \| )(\d*%)/);
                    if (matches && matches.length) {
                        json.push({
                            name: 'b' + matches[1].replace(',', 'c'),
                            status: matches[2],
                            position: parseInt(matches[3]),
                            signal: matches[4]
                        });
                    }
                }
                resolve(json);
                conn.disconnect();
            });
        });
        conn.on('esl::end', function () {
            if (!connected) {
                reject('connection failed');
            }
        });
    });
}

exports.getSignalInfo = getSignalInfo;