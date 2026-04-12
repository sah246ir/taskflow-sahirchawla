"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectAccessMiddleware = void 0;
const config_1 = require("../config");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const projectAccessMiddleware = async (req, res, next) => {
    const { projectId } = req.params;
    if (!projectId) {
        throw new error_1.AppError("VALIDATION_ERROR", "Project ID is required for this route");
    }
    const userId = req.user.userId;
    const project = await config_1.prisma.project.findFirst({
        where: {
            OR: [
                { id: projectId, owner_id: userId },
                {
                    id: projectId,
                    tasks: { some: { assignee_id: userId } },
                },
            ],
        },
        select: { id: true, owner_id: true },
    });
    if (!project) {
        return res.status(403).json((0, response_1.errorResponse)("forbidden"));
    }
    next();
};
exports.projectAccessMiddleware = projectAccessMiddleware;
//# sourceMappingURL=project.middleware.js.map