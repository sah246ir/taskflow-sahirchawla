"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSecret = exports.clients = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.clients = process.env.CLIENTS?.split(",") || [];
exports.jwtSecret = process.env.JWT_SECRET;
//# sourceMappingURL=env.js.map