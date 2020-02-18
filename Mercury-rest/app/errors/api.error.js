
/**
 * @extends Error
 */
const httpStatus = require('http-status');

class ExtendableError extends Error {
    constructor({
        message, errors, code, isPublic, stack,
    }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.errors = errors;
        this.code = code;
        this.isPublic = isPublic;
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        this.stack = stack;
        // Error.captureStackTrace(this, this.constructor.name);
    }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor({
        message,
        errors,
        stack,
        code = httpStatus.INTERNAL_SERVER_ERROR,
        isPublic = false,
    }) {
        super({
            message, errors, code, isPublic, stack,
        });
    }
}

module.exports = APIError;
