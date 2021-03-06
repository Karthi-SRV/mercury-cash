const httpStatus = require('http-status');

module.exports = {
    RequiredParamsNotFoundError: {
        code: httpStatus.NOT_FOUND,
        message: 'Required params not found',
    },
    AirportNotFound: {
        code: httpStatus.NOT_FOUND,
        message: 'Airport station not found',
    },
    NameNotExists: {
        code: httpStatus.EXPECTATION_FAILED,
        message: 'Please provide valid airport name',
    },
    CodeNotExists: {
        code: httpStatus.EXPECTATION_FAILED,
        message: 'Please provide valid airport code',
    },
    CodeAlreadyExists: {
        code: httpStatus.EXPECTATION_FAILED,
        message: 'The given airport code already been used',
    },
    FromStationNotFound: {
        code: httpStatus.EXPECTATION_FAILED,
        message: 'Please provide valid From station',
    },
    ToStationNotFound: {
        code: httpStatus.EXPECTATION_FAILED,
        message: 'Please provide valid To station',
    },
    RouteAlreadyExists: {
        code: httpStatus.EXPECTATION_FAILED,
        message: 'The given route already exists',
    },
    FromAndToStationNotBeSame: {
        code: httpStatus.EXPECTATION_FAILED,
        message: 'From and To Station should not be same',
    },
    RouteNotFound: {
        code: httpStatus.NOT_FOUND,
        message: 'Route Not found',
    }
};
