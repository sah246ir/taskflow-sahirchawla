"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskController = exports.updateTaskController = exports.createTaskController = exports.listProjectTasksController = void 0;
const client_1 = require("@prisma/client");
const task_schema_1 = require("../schema/task.schema");
const task_service_1 = require("../services/task.service");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const project_schema_1 = require("../schema/project.schema");
const toUtcDateOnly = (s) => new Date(`${s}T00:00:00.000Z`);
const listProjectTasksController = async (req, res) => {
    try {
        const { projectId } = project_schema_1.projectIdParamSchema.parse(req.params);
        const query = task_schema_1.listTasksQuerySchema.parse(req.query);
        const result = await (0, task_service_1.listTasks)(req.user.userId, projectId, {
            filters: {
                status: query.status,
                assignee: query.assignee,
                priority: query.priority,
            },
            pagination: {
                page: query.page,
                limit: query.limit,
            },
        });
        res.status(200).json((0, response_1.successResponse)({
            tasks: result.data,
            meta: result.meta,
        }));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.listProjectTasksController = listProjectTasksController;
const createTaskController = async (req, res) => {
    try {
        const { projectId } = project_schema_1.projectIdParamSchema.parse(req.params);
        const body = task_schema_1.createTaskSchema.parse(req.body);
        const task = await (0, task_service_1.createTask)(req.user.userId, projectId, {
            title: body.title,
            description: body.description,
            status: body.status ?? client_1.TaskStatus.todo,
            priority: body.priority ?? client_1.TaskPriority.medium,
            assignee_id: body.assignee_id,
            due_date: body.due_date ? toUtcDateOnly(body.due_date) : undefined,
        });
        res.status(201).json((0, response_1.successResponse)(task));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.createTaskController = createTaskController;
const updateTaskController = async (req, res) => {
    try {
        const { id } = task_schema_1.taskIdParamSchema.parse(req.params);
        const body = task_schema_1.updateTaskSchema.parse(req.body);
        const task = await (0, task_service_1.updateTask)(req.user.userId, id, {
            title: body.title,
            description: body.description,
            status: body.status,
            priority: body.priority,
            assignee_id: body.assignee_id,
            due_date: body.due_date === undefined
                ? undefined
                : body.due_date === null
                    ? null
                    : toUtcDateOnly(body.due_date),
        });
        res.status(200).json((0, response_1.successResponse)(task));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.updateTaskController = updateTaskController;
const deleteTaskController = async (req, res) => {
    try {
        const { id } = task_schema_1.taskIdParamSchema.parse(req.params);
        await (0, task_service_1.deleteTask)(req.user.userId, id);
        res.status(204).send();
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.deleteTaskController = deleteTaskController;
//# sourceMappingURL=task.controller.js.map