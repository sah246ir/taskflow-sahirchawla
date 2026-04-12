"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
beforeAll(async () => {
    // clean db before all tests
    await config_1.prisma.task.deleteMany();
    await config_1.prisma.project.deleteMany();
    await config_1.prisma.user.deleteMany();
});
afterAll(async () => {
    await config_1.prisma.$disconnect();
});
//# sourceMappingURL=setup.js.map