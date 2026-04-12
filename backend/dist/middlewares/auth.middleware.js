"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_schema_1 = require("../schema/auth.schema");
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json((0, response_1.errorResponse)("unauthorized"));
    }
    try {
        const decoded = (0, jwt_1.verifyJwtToken)(token);
        const payload = auth_schema_1.jwtPayloadSchema.parse(decoded);
        req.user = payload;
        return next();
    }
    catch {
        return res.status(401).json((0, response_1.errorResponse)("unauthorized"));
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map