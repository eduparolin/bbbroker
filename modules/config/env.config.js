module.exports = {
    "elasticsearch": {
        "host": "elastic.service.cwb1.tunts.net",
        "indexPattern": "[logs-pgmais-broker-gsm-]YYYY.MM.DD",
        "logLevel": 10,
        "logName": "logs-pgmais-broker-gsm",
        "type": "logs"
    },
    "jwt": {
        "expiresIn": 3600000,
        "secret": "Q0MGU3NDYiLCJlbWFpbCI6ImpvYl9ydW5uZXJ"
    },
    mickey: {
        url: 'http://production-auto-deploy.gf-mickey.svc.cluster.local:5000/sms/'
    },
    autoDiscovery: {
        chipNumber: '41984630091'
    }
};
