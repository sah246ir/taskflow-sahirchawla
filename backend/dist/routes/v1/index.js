"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const project_routes_1 = require("./project.routes");
const task_routes_1 = require("./task.routes");
exports.v1Router = (0, express_1.Router)();
exports.v1Router.use("/auth", auth_routes_1.authRouter);
exports.v1Router.use("/projects", project_routes_1.projectRouter);
exports.v1Router.use("/tasks", task_routes_1.taskRouter);
//# sourceMappingURL=index.js.map