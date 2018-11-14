const xpath = require('xpath')
    , Dom = require('xmldom').DOMParser;

exports.extract = (xml, fields) => {

    if (!xml || !fields) {
        return {};
    }

    let result = {};
    let doc = new Dom().parseFromString(xml);

    for (let i in fields) {
        let path = fields[i];
        let type = undefined;
        if (typeof fields[i] === 'object') {
            path = fields[i].path;
            type = fields[i].type;
        }
        let nodes = xpath.select(path, doc);

        if (nodes && nodes[0] && (nodes[0].firstChild || nodes[0].value)) {
            result[i] = decodeURIComponent(nodes[0].firstChild ? nodes[0].firstChild.data : nodes[0].value);
            //console.log(nodes[0].firstChild.data, result[i]);
            if (type) {
                result[i] = new type(result[i]);
            }
        } else {
            result[i] = undefined;
        }

    }

    return result;

};