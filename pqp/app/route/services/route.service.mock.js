exports.getRoute = function getRoute() {
    return Promise.resolve({
        distribuition_type: 'preferential',
        fallback_monthly_limit: 1,
        tags:
            [{
                tag: 'GIGATEC00',
                driver: '1',
                max_delay: 2,
                max_real_delay: 10,
                priority_order: 97,
                max_per_hour: 200,
                max_simultaneous: 200,
                is_fallback: 0,
                is_enabled: 1,
                respect_capacity: 1
            },
                {
                    tag: 'movile',
                    driver: '1',
                    max_delay: null,
                    max_real_delay: null,
                    priority_order: null,
                    max_per_hour: 200,
                    max_simultaneous: 200,
                    is_fallback: 1,
                    is_enabled: 1,
                    respect_capacity: 1
                },
                {
                    tag: 'OTIMABK00',
                    driver: '1',
                    max_delay: 2,
                    max_real_delay: 10,
                    priority_order: 98,
                    max_per_hour: 200,
                    max_simultaneous: 200,
                    is_fallback: 0,
                    is_enabled: 1,
                    respect_capacity: 1
                }
            ]
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