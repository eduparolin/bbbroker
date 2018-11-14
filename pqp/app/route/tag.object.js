let tag = [];

function set(value) {
    tag = value;
}

function get() {
    return tag;
}

exports.set = set;
exports.get = get;