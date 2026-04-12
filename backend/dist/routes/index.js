"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const v1_1 = require("./v1");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use("/v1", v1_1.v1Router);
//# sourceMappingURL=index.js.map