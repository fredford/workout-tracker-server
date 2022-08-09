"use strict";
// Relay for handling error messages and their corresponding status code.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=errorResponse.js.map