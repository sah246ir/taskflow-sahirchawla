"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.taskIdParamSchema = exports.createTaskSchema = exports.listTasksQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
exports.listTasksQuerySchema = zod_1.default.object({
    status: zod_1.default.enum(client_1.TaskStatus).optional(),
    assignee: zod_1.default.string().optional(),
    page: zod_1.default.coerce.number().optional(),
    limit: zod_1.default.coerce.number().optional(),
    priority: zod_1.default.enum(client_1.TaskPriority).optional(),
});
exports.createTaskSchema = zod_1.default.object({
    title: zod_1.default.string().min(1),
    description: zod_1.default.string().optional(),
    status: zod_1.default.enum(client_1.TaskStatus).optional(),
    priority: zod_1.default.enum(client_1.TaskPriority).optional(),
    assignee_id: zod_1.default.string().uuid().nullable().optional(),
    due_date: zod_1.default
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional().nullable(),
});
exports.taskIdParamSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
});
exports.updateTaskSchema = zod_1.default
    .object({
    title: zod_1.default.string().min(1).optional(),
    description: zod_1.default.string().optional(),
    status: zod_1.default.enum(client_1.TaskStatus).optional(),
    priority: zod_1.default.enum(client_1.TaskPriority).optional(),
    assignee_id: zod_1.default.string().uuid().nullable().optional(),
    due_date: zod_1.default
        .union([
        zod_1.default.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        zod_1.default.null(),
    ])
        .optional(),
})
    .refine((data) => data.title !== undefined ||
    data.description !== undefined ||
    data.status !== undefined ||
    data.priority !== undefined ||
    data.assignee_id !== undefined ||
    data.due_date !== undefined, { message: "at least one field is required", path: ["title"] });
//# sourceMappingURL=task.schema.js.map