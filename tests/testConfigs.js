module.exports = {
    success: {
        gateway: {
            id: '96bd0802-40fe-4ada-84eb-e4f6f6145be2',
            host: '10.41.1.39',
            channel: 'b00c012',
            type: 'khomp'
        },
        message: {
            destination: '41999500033',
            text: 'Test'
        },
        chip: [
            {
                number: '41984630091',
                operator: 'OI',
                base_day: '26',
                received: 0,
                sent_on_net: 0,
                limit_on_net: 1,
                sent_off_net: 0,
                limit_off_net: 1
            },
            {
                number: '41984108380',
                operator: 'OI',
                base_day: '26',
                received: 0,
                sent_on_net: 0,
                limit_on_net: 5,
                sent_off_net: 0,
                limit_off_net: 1
            },
            {
                number: '41984501819',
                operator: 'OI',
                base_day: '26',
                received: 0,
                sent_on_net: 0,
                limit_on_net: 1,
                sent_off_net: 0,
                limit_off_net: 1
            }
        ],
        channel: {
            status: 'FREE',
            gw_reference: 'B00C00'
        },
        route: {
            name: 'Route1',
            prefix: '0001',
            operator: 'OI'
        },
        sms: {
            direction: 'OUTBOUND',
            origin: '41984108380',
            destination: '41999500033',
            message: 'Hello',
            sent_at: new Date()
        },
        sendSms: {
            "from": "HOME",
            "to": "41996682499",
            "message": "teste3",
            "operator": "OI"
        }
    },
    fail: {
        gateway: {
            host: '10.41.1.1',
            channel: 'b100c112'
        },
        message: {
            destination: 'WrongNumberYo'
        },
        sms: {
            "from": "HOMEFAIL",
            "to": "41996682499",
            "message": "teste3",
            "operator": "OI"
        }
    }
};
