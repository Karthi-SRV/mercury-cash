const APIError = require('./api.error'),
    _ = require('lodash');

exports.getErrorMessage = (err) => {
    const error = {
        code: _.get(err, 'code', 500),
        message: _.get(err, 'message', 'Internal Server Error'),
        stack: _.get(err, 'stack', 'Error Type Not Found'),
    };
    if (err instanceof APIError) {
        error['code'] = err.code;
        error['message'] = err.message;
        error['stack'] = err.stack || null;
        return error;
    }
    return error;
};
