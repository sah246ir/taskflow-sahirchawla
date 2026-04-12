"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_middleware_1 = require("./middlewares/cors.middleware");
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: config_1.clients,
    credentials: true
}));
app.use((req, res, next) => {
    if (!req.body)
        req.body = {};
    next();
});
app.use(cors_middleware_1.corsMiddleware);
app.use(body_parser_1.default.json());
app.use("/api", routes_1.apiRouter);
//# sourceMappingURL=app.js.map