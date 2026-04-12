"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectStats = exports.getProjectUsers = exports.DeleteProject = exports.UpdateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const config_1 = require("../config");
const error_1 = require("../utils/error");
const pagination_1 = require("../utils/pagination");
const getProjects = async (userId, options) => {
    const { limit, page, skip, take } = (0, pagination_1.getPaginationParams)(options.pagination);
    const where = {
        OR: [
            {
                owner_id: userId
            },
            {
                tasks: {
                    some: {
                        assignee_id: userId
                    }
                }
            }
        ]
    };
    const projects = await config_1.prisma.project.findMany({
        where: where,
        select: {
            name: true,
            description: true,
            id: true,
            owner_id: true,
            created_at: true
        },
        skip,
        take,
    });
    const total = await config_1.prisma.project.count({
        where: where
    });
    return (0, pagination_1.buildPaginatedResponse)(projects, total, page, limit);
};
exports.getProjects = getProjects;
const getProjectById = async (userId, projectId) => {
    const where = {
        OR: [
            {
                id: projectId,
                owner_id: userId
            },
            {
                id: projectId,
                tasks: {
                    some: {
                        assignee_id: userId
                    }
                }
            }
        ]
    };
    const project = await config_1.prisma.project.findFirst({
        where: where,
        select: {
            id: true,
            name: true,
            description: true,
            owner_id: true,
            created_at: true,
            tasks: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    assignee_id: true,
                    due_date: true,
                    created_at: true,
                    updated_at: true
                }
            }
        }
    });
    if (!project) {
        throw new error_1.AppError("NOT_FOUND", "Project not found");
    }
    return project;
};
exports.getProjectById = getProjectById;
const createProject = async (userId, name, description) => {
    const existingproject = await config_1.prisma.project.findFirst({
        where: {
            name,
            owner_id: userId
        }
    });
    if (existingproject) {
        throw new error_1.AppError("CONFLICT", "Project with this name already exists");
    }
    const project = await config_1.prisma.project.create({
        data: {
            name,
            description,
            owner_id: userId
        }
    });
    return project;
};
exports.createProject = createProject;
const UpdateProject = async (userId, projectId, name, description) => {
    const project = await config_1.prisma.project.findFirst({
        where: {
            owner_id: userId,
            id: projectId
        }
    });
    if (!project) {
        throw new error_1.AppError("NOT_FOUND", "Project not found");
    }
    const newproject = await config_1.prisma.project.update({
        where: {
            owner_id: userId,
            id: projectId
        },
        data: {
            ...(name ? { name } : {}),
            ...(description ? { description } : {}),
        }
    });
    return newproject;
};
exports.UpdateProject = UpdateProject;
const DeleteProject = async (userId, projectId) => {
    const project = await config_1.prisma.project.findFirst({
        where: {
            owner_id: userId,
            id: projectId
        }
    });
    if (!project) {
        throw new error_1.AppError("NOT_FOUND", "Project not found");
    }
    await config_1.prisma.project.delete({
        where: {
            owner_id: userId,
            id: projectId
        }
    });
    return true;
};
exports.DeleteProject = DeleteProject;
const getProjectUsers = async (projectId) => {
    const users = await config_1.prisma.user.findMany({
        where: {
            assigned_tasks: {
                some: {
                    project_id: projectId
                }
            }
        }
    });
    return users;
};
exports.getProjectUsers = getProjectUsers;
const projectStats = async (projectId) => {
    const [todo, in_progress, done] = await Promise.all([
        config_1.prisma.task.count({ where: { project_id: projectId, status: "todo" } }),
        config_1.prisma.task.count({ where: { project_id: projectId, status: "in_progress" } }),
        config_1.prisma.task.count({ where: { project_id: projectId, status: "done" } })
    ]);
    const recent5Tasks = await config_1.prisma.task.findMany({
        where: {
            project_id: projectId
        },
        orderBy: {
            created_at: "desc"
        },
        take: 5,
        include: {
            assignee: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    return {
        todo,
        in_progress,
        done,
        recent5Tasks
    };
};
exports.projectStats = projectStats;
//# sourceMappingURL=project.service.js.map