"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_middleware_1 = require("./middlewares/cors.middleware");
const app = (0, express_1.default)();
app.use(cors_middleware_1.corsMiddleware);
app.listen(8000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map