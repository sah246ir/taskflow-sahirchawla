"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data) => {
    return {
        success: true,
        data
    };
};
exports.successResponse = successResponse;
const errorResponse = (message, context) => {
    return {
        error: message,
        ...(context ? context : {})
    };
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=response.js.map