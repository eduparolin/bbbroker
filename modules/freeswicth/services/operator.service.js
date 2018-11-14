let operatorMap = {
    "BRA BrTCelular": "OI",
    "Claro": "CLARO"
};

function findOperator(fsStatus) {
    let fsOperator = fsStatus.split('(')[1];
    fsOperator = fsOperator.substring(0, fsOperator.indexOf(')'));
    return operatorMap[fsOperator];
}

exports.findOperator = findOperator;
