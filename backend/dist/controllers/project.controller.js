"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectStatsController = exports.deleteProjectController = exports.updateProjectController = exports.getProjectUsersController = exports.getProjectByIdController = exports.createProjectController = exports.listProjectsController = void 0;
const project_schema_1 = require("../schema/project.schema");
const project_service_1 = require("../services/project.service");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const listProjectsController = async (req, res) => {
    try {
        const query = project_schema_1.listProjectsQuerySchema.parse(req.query);
        const result = await (0, project_service_1.getProjects)(req.user.userId, { pagination: query });
        res.status(200).json((0, response_1.successResponse)({
            projects: result.data,
            meta: result.meta,
        }));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.listProjectsController = listProjectsController;
const createProjectController = async (req, res) => {
    try {
        const body = project_schema_1.createProjectSchema.parse(req.body);
        const project = await (0, project_service_1.createProject)(req.user.userId, body.name, body.description ?? "");
        res.status(201).json((0, response_1.successResponse)(project));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.createProjectController = createProjectController;
const getProjectByIdController = async (req, res) => {
    try {
        const { projectId } = project_schema_1.projectIdParamSchema.parse(req.params);
        const project = await (0, project_service_1.getProjectById)(req.user.userId, projectId);
        res.status(200).json((0, response_1.successResponse)(project));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.getProjectByIdController = getProjectByIdController;
const getProjectUsersController = async (req, res) => {
    try {
        const { projectId } = project_schema_1.projectIdParamSchema.parse(req.params);
        const users = await (0, project_service_1.getProjectUsers)(projectId);
        res.status(200).json((0, response_1.successResponse)(users));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.getProjectUsersController = getProjectUsersController;
const updateProjectController = async (req, res) => {
    try {
        const { projectId } = project_schema_1.projectIdParamSchema.parse(req.params);
        const body = project_schema_1.updateProjectSchema.parse(req.body);
        const project = await (0, project_service_1.UpdateProject)(req.user.userId, projectId, body.name, body.description);
        res.status(200).json((0, response_1.successResponse)(project));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.updateProjectController = updateProjectController;
const deleteProjectController = async (req, res) => {
    try {
        const { projectId } = project_schema_1.projectIdParamSchema.parse(req.params);
        await (0, project_service_1.DeleteProject)(req.user.userId, projectId);
        res.status(204).send();
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.deleteProjectController = deleteProjectController;
const getProjectStatsController = async (req, res) => {
    try {
        const { projectId } = project_schema_1.projectIdParamSchema.parse(req.params);
        const stats = await (0, project_service_1.projectStats)(projectId);
        res.status(200).json((0, response_1.successResponse)(stats));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.getProjectStatsController = getProjectStatsController;
//# sourceMappingURL=project.controller.js.map