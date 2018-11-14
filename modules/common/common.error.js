class CommonError {
    constructor(httpStatusCode, errorCode, reqId, message, errors = []) {
        this.httpStatusCode = httpStatusCode;
        this.errorCode = errorCode;
        this.reqId = reqId;
        this.message = message;
        this.errors = errors;
    }
}

module.exports = CommonError;