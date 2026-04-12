"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.listTasks = void 0;
const config_1 = require("../config");
const client_1 = require("@prisma/client");
const error_1 = require("../utils/error");
const pagination_1 = require("../utils/pagination");
const getTaskProjectById = async (taskId) => {
    const task = await config_1.prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true },
    });
    if (!task) {
        throw new error_1.AppError("NOT_FOUND", "Task not found");
    }
    return task;
};
const listTasks = async (userId, projectId, options) => {
    const { limit, page, skip, take } = (0, pagination_1.getPaginationParams)(options.pagination);
    const where = {
        project_id: projectId,
        ...(options.filters.status ? { status: options.filters.status } : {}),
        ...(options.filters.assignee ? { assignee_id: options.filters.assignee } : {}),
        ...(options.filters.priority ? { priority: options.filters.priority } : {}),
    };
    const tasks = await config_1.prisma.task.findMany({
        where,
        orderBy: { created_at: "asc" },
        skip,
        take,
        include: {
            assignee: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        }
    });
    const total = await config_1.prisma.task.count({ where });
    return (0, pagination_1.buildPaginatedResponse)(tasks, total, page, limit);
};
exports.listTasks = listTasks;
const createTask = async (userId, projectId, input) => {
    const project = await config_1.prisma.project.findUnique({
        where: { id: projectId },
    });
    const isOwner = project?.owner_id === userId;
    return config_1.prisma.task.create({
        data: {
            title: input.title,
            description: input.description,
            status: input.status ?? client_1.TaskStatus.todo,
            priority: input.priority,
            project_id: projectId,
            assignee_id: isOwner ? input.assignee_id || userId : userId,
            due_date: input.due_date ?? undefined,
            creator_id: userId,
        },
    });
};
exports.createTask = createTask;
const updateTask = async (userId, taskId, input) => {
    const task = await getTaskProjectById(taskId);
    const isOwner = task.project.owner_id === userId;
    const isAssignee = task.assignee_id === userId;
    const isCreator = task.creator_id === userId;
    if (!isOwner && !isAssignee && !isCreator) {
        throw new error_1.AppError("FORBIDDEN", "You are not authorized to update this task");
    }
    return config_1.prisma.task.update({
        where: { id: taskId },
        data: {
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
            ...(input.priority !== undefined ? { priority: input.priority } : {}),
            ...(input.assignee_id !== undefined ? { assignee_id: input.assignee_id } : {}),
            ...(input.due_date !== undefined ? { due_date: input.due_date } : {}),
        },
    });
};
exports.updateTask = updateTask;
const deleteTask = async (userId, taskId) => {
    const task = await getTaskProjectById(taskId);
    const isOwner = task.project.owner_id === userId;
    const isCreator = task.creator_id === userId;
    if (!isOwner && !isCreator) {
        throw new error_1.AppError("FORBIDDEN", "Cannot delete this task");
    }
    await config_1.prisma.task.delete({
        where: { id: taskId },
    });
    return true;
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.service.js.map