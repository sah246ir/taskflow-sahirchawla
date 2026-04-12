"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.signJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const signJwtToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ userId, email }, env_1.jwtSecret, { expiresIn: "1h" });
};
exports.signJwtToken = signJwtToken;
const verifyJwtToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.jwtSecret);
};
exports.verifyJwtToken = verifyJwtToken;
//# sourceMappingURL=jwt.js.map