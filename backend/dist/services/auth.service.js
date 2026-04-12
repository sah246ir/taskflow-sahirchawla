"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.getUsers = exports.getProfile = exports.registerUser = exports.loginUser = void 0;
const config_1 = require("../config");
const error_1 = require("../utils/error");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const loginUser = async (email, password) => {
    const userByEmail = await config_1.prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!userByEmail) {
        throw new error_1.AppError("UNAUTHORIZED", "Invalid credentials");
    }
    const isPasswordValid = (0, password_1.verifyPassword)(password, userByEmail.password);
    if (!isPasswordValid) {
        throw new error_1.AppError("UNAUTHORIZED", "Invalid credentials");
    }
    const token = (0, jwt_1.signJwtToken)(userByEmail.id, userByEmail.email);
    return {
        token
    };
};
exports.loginUser = loginUser;
const registerUser = async (name, email, password) => {
    const userByEmail = await config_1.prisma.user.findFirst({
        where: {
            email,
        }
    });
    if (userByEmail) {
        throw new error_1.AppError("CONFLICT", "User with this email already exists. try logging in");
    }
    const hashedPassword = await (0, password_1.hashPassword)(password);
    const user = await config_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    const token = (0, jwt_1.signJwtToken)(user.id, user.email);
    return {
        token
    };
};
exports.registerUser = registerUser;
const getProfile = async (userId) => {
    const userById = await config_1.prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            name: true,
            email: true,
            id: true
        }
    });
    if (!userById)
        throw new error_1.AppError('NOT_FOUND', 'user not found');
    return userById;
};
exports.getProfile = getProfile;
const getUsers = async (q) => {
    const users = await config_1.prisma.user.findMany({
        select: {
            name: true,
            email: true,
            id: true
        },
        where: {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } }
            ]
        },
        take: 20
    });
    return users;
};
exports.getUsers = getUsers;
const getUserStats = async (userId) => {
    const [todo, in_progress, done] = await Promise.all([
        config_1.prisma.task.count({ where: { assignee_id: userId, status: "todo" } }),
        config_1.prisma.task.count({ where: { assignee_id: userId, status: "in_progress" } }),
        config_1.prisma.task.count({ where: { assignee_id: userId, status: "done" } }),
    ]);
    const assignedRows = await config_1.prisma.task.findMany({
        where: { assignee_id: userId },
        select: {
            project_id: true,
            status: true,
            project: { select: { id: true, name: true } },
        },
    });
    const byProjectMap = new Map();
    for (const row of assignedRows) {
        const pid = row.project_id;
        let entry = byProjectMap.get(pid);
        if (!entry) {
            entry = {
                projectId: row.project.id,
                projectName: row.project.name,
                todo: 0,
                in_progress: 0,
                done: 0,
            };
            byProjectMap.set(pid, entry);
        }
        if (row.status === "todo")
            entry.todo += 1;
        else if (row.status === "in_progress")
            entry.in_progress += 1;
        else if (row.status === "done")
            entry.done += 1;
    }
    const byProject = Array.from(byProjectMap.values()).sort((a, b) => a.projectName.localeCompare(b.projectName));
    const recent5Tasks = await config_1.prisma.task.findMany({
        where: { assignee_id: userId },
        orderBy: { created_at: "desc" },
        take: 5,
        include: {
            project: { select: { id: true, name: true } },
            assignee: { select: { id: true, name: true, email: true } },
        },
    });
    return {
        todo,
        in_progress,
        done,
        byProject,
        recent5Tasks,
    };
};
exports.getUserStats = getUserStats;
//# sourceMappingURL=auth.service.js.map