let rp = require('request-promise');

function sendVariousMessages() {
    for (let i = 0; i < 1000; i++) {

        let options = {
            method: 'GET',
            uri: 'http://189.84.131.51/pgmais-2018-010-staging/messages/statistics/row?tag=BROKER',
            /*headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphcnZpc0B0dW50c2NvcnAuY29tIiwiaWF0IjoxNTM2MDcyMzcwLCJleHAiOjE1Mzk2NzIzNzB9.Qvuhxlf0K57XA96wrj9Yq--zVgWS7gMOQpXS2oss2yc"
            },*/
            // body: {
            //     "from": "HOME",
            //     "to": "41984331027",
            //     "message": 'Message: ' + i,sendWebhookSMSParams
            //     "operator": "OI"
            // },
            json: true
        };

        rp(options)
            .then((resp) => {
                console.log(resp, i);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

sendVariousMessages();
