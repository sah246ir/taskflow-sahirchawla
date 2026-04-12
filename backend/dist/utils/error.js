"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.statusFromCode = exports.AppError = void 0;
const zod_1 = require("zod");
const response_1 = require("./response");
class AppError extends Error {
    constructor(code, message, meta // optional metadata
    ) {
        super(message);
        this.code = code;
        this.meta = meta;
    }
}
exports.AppError = AppError;
exports.statusFromCode = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    VALIDATION_ERROR: 400,
};
const zodToFieldErrors = (err) => {
    const fields = {};
    for (const issue of err.issues) {
        const path = issue.path.join(".") || "_root";
        if (!fields[path]) {
            fields[path] = issue.message;
        }
    }
    return fields;
};
const handleError = (error, res) => {
    if (error instanceof zod_1.ZodError) {
        return res
            .status(400)
            .json((0, response_1.errorResponse)("validation failed", { fields: zodToFieldErrors(error) }));
    }
    if (error instanceof AppError) {
        const status = exports.statusFromCode[error.code];
        if (error.code === "VALIDATION_ERROR" && error.meta?.fields) {
            return res.status(status).json((0, response_1.errorResponse)(error.message || "validation failed", {
                fields: error.meta.fields,
            }));
        }
        if (error.code === "NOT_FOUND") {
            return res.status(status).json((0, response_1.errorResponse)(error.message || "not found"));
        }
        if (error.code === "UNAUTHORIZED") {
            return res.status(status).json((0, response_1.errorResponse)(error.message || "unauthorized"));
        }
        if (error.code === "FORBIDDEN") {
            return res.status(status).json((0, response_1.errorResponse)(error.message || "forbidden"));
        }
        return res.status(status).json((0, response_1.errorResponse)(error.message || "internal server error"));
    }
    console.error(error);
    return res.status(500).json((0, response_1.errorResponse)("internal server error"));
};
exports.handleError = handleError;
//# sourceMappingURL=error.js.map