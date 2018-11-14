module.exports = {
    'database': {
        'name': 'gf_broker',
        'host': '35.198.3.4',
        'password': 'fakePass!PgMais',
        'user': 'gf_broker'
    },
    'elasticsearch': {
        'host': 'elastic.service.cwb1.tunts.net',
        'indexPattern': '[logs-pgmais-broker-gsm-]YYYY.MM.DD',
        'logLevel': 10,
        'logName': 'logs-pgmais-broker-gsm',
        'type': 'logs'
    },
    'port': 5000,
    'secret': 'banana',
    'fsHost':'10.41.1.39'
};

