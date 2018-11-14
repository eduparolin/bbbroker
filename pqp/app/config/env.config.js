module.exports = {
    "elasticsearch": {
        "host": "elastic.service.cwb1.tunts.net",
        "indexPattern": "[logs-pgmais-sms-db-integrator-]YYYY.MM.DD",
        "logLevel": 50,
        "logName": "logs-pgmais-sms-db-integrator",
        "type": "logs"
    },
    "producer_job_options": {
        "timeout": 10*1000,
        "error_timeout": 15*1000
    },
    "consumer_job_options": {
        "timeout": 10,
        "error_timeout": 100
    },
    "mysql_pool": {
        connectionLimit : 20,
        host            : '10.150.30.76',
        port            : 3306,
        user            : 'gestao_fornecedores',
        password        : 'PG&1453490gf',
        database        : 'esms',
        dateStrings : true
    },
    "filter_pool": {
        connectionLimit : 20,
        host            : '35.198.3.4',
        port            : 3306,
        user            : 'gf_filter',
        password        : 'fakePass!PgMais',
        database        : 'gf_filter',
        dateStrings : true
    },
    "sms_config": {
        "table_name": "MO_ESMS",
        "message_status": "WAITING",
        "route": "20000"
    },
    "date_config": {
        "table_name": "dates"
    },
    "message_insert": {
        "url": "http://production-auto-deploy.pg-jqueue.svc.cluster.local:5000/messages"
    },
    "message_reservation": {
        "url": "http://production-auto-deploy.pg-jqueue-r.svc.cluster.local:5000/reservation",
        "timeToRun": 60
    },
    "message_delete": {
        "url": "http://production-auto-deploy.pg-jqueue-r.svc.cluster.local:5000/messages/"
    },
    "message_bury": {
        "url": "http://production-auto-deploy.pg-jqueue-r.svc.cluster.local:5000/messages/"
    },
    "message_release": {
        "url": "http://production-auto-deploy.pg-jqueue-r.svc.cluster.local:5000/messages/"
    },
    "tag_get": {
        "url": "http://production-auto-deploy.pgrm.svc.cluster.local:5000/routeManager/"
    },
    "route_job_options": {
        "timeout": 5*1000
    },
    "mickey": {
        "jobSuccessTimeout": 60*1000,
        "jobFailTimeout": 180*1000,
        "initialHour": 0,//24 hours format
        "finalHour": 24,//24 hours format
        "url": "http://189.84.131.51/pg016-mickey/sms"
    },
    "routeManager": {
        "url": "http://production-auto-deploy.pgrm.svc.cluster.local:5000/routeManager/",
        "route": 20000,
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphcnZpc0B0dW50c2NvcnAuY29tIn0.jhQhM8L3N31hhGfXKfG6m6OuorJVhieciNBGkkKbn5w"
    },
    "jqueue": {
        "url": "http://production-auto-deploy.pg-jqueue.svc.cluster.local:5000/"
    }
};