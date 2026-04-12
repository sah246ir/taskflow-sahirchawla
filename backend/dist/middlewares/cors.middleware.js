"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = corsMiddleware;
const env_1 = require("../config/env");
function corsMiddleware(req, res, next) {
    res.header('Access-Control-Allow-Origin', ...env_1.clients);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
//# sourceMappingURL=cors.middleware.js.map