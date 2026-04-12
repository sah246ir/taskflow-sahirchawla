"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = exports.jwtPayloadSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.jwtPayloadSchema = zod_1.default.object({
    userId: zod_1.default.string(),
    email: zod_1.default.string()
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8)
});
exports.registerSchema = zod_1.default.object({
    name: zod_1.default.string().min(3),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8)
});
//# sourceMappingURL=auth.schema.js.map