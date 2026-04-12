"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = exports.listProjectsQuerySchema = exports.projectIdParamSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.projectIdParamSchema = zod_1.default.object({
    projectId: zod_1.default.string().uuid(),
});
exports.listProjectsQuerySchema = zod_1.default.object({
    page: zod_1.default.coerce.number().optional(),
    limit: zod_1.default.coerce.number().optional(),
});
exports.createProjectSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    description: zod_1.default.string().optional(),
});
exports.updateProjectSchema = zod_1.default
    .object({
    name: zod_1.default.string().min(1).optional(),
    description: zod_1.default.string().optional(),
})
    .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "at least one of name or description is required",
    path: ["name"],
});
//# sourceMappingURL=project.schema.js.map