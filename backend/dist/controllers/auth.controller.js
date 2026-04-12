"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStatsController = exports.getUsersController = exports.meController = exports.registerController = exports.loginController = void 0;
const auth_schema_1 = require("../schema/auth.schema");
const auth_service_1 = require("../services/auth.service");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const loginController = async (req, res) => {
    try {
        const { email, password } = auth_schema_1.loginSchema.parse(req.body);
        const data = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json((0, response_1.successResponse)(data));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.loginController = loginController;
const registerController = async (req, res) => {
    try {
        const { email, password, name } = auth_schema_1.registerSchema.parse(req.body);
        const data = await (0, auth_service_1.registerUser)(name, email, password);
        res.status(201).json((0, response_1.successResponse)(data));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.registerController = registerController;
const meController = async (req, res) => {
    try {
        console.log(req.user?.userId);
        const data = await (0, auth_service_1.getProfile)(req.user?.userId);
        res.status(200).json((0, response_1.successResponse)(data));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.meController = meController;
const getUsersController = async (req, res) => {
    try {
        const q = req.query.q;
        const data = await (0, auth_service_1.getUsers)(q);
        res.status(200).json((0, response_1.successResponse)(data));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.getUsersController = getUsersController;
const getUserStatsController = async (req, res) => {
    try {
        const data = await (0, auth_service_1.getUserStats)(req.user?.userId);
        res.status(200).json((0, response_1.successResponse)(data));
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
};
exports.getUserStatsController = getUserStatsController;
//# sourceMappingURL=auth.controller.js.map