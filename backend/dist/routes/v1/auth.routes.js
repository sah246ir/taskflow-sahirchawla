"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login", auth_controller_1.loginController);
exports.authRouter.post("/register", auth_controller_1.registerController);
exports.authRouter.get("/me", auth_middleware_1.authMiddleware, auth_controller_1.meController);
exports.authRouter.get("/users", auth_middleware_1.authMiddleware, auth_controller_1.getUsersController);
exports.authRouter.get("/stats", auth_middleware_1.authMiddleware, auth_controller_1.getUserStatsController);
//# sourceMappingURL=auth.routes.js.map