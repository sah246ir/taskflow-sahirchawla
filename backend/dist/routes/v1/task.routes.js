"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const task_controller_1 = require("../../controllers/task.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
exports.taskRouter = (0, express_1.Router)();
exports.taskRouter.use(auth_middleware_1.authMiddleware);
exports.taskRouter.patch("/:id", task_controller_1.updateTaskController);
exports.taskRouter.delete("/:id", task_controller_1.deleteTaskController);
//# sourceMappingURL=task.routes.js.map