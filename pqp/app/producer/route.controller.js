const tag = require('../route/tag.object');

exports.getTag = () => {
    let route = tag.get();
    let allTags = route.tags;
    if(allTags.length) {
        let response = allTags[0];
        for (let tag of allTags) {
            if(tag.priority_order > response.priority_order) {
                response = tag
            }
        }
        return Promise.resolve(response.tag);
    } else {
        return Promise.reject('no tag for this route');
    }
};