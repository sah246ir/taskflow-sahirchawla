"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const password_1 = require("../utils/password");
const prisma_1 = require("./prisma");
const seed = async () => {
    const password = await (0, password_1.hashPassword)("password123");
    await prisma_1.prisma.user.create({
        data: {
            name: "John Doe",
            email: "test@example.com",
            password: password
        }
    });
    console.log("User created");
    console.log("Email: ", "test@example.com");
    console.log("Password: ", password);
};
exports.seed = seed;
//# sourceMappingURL=seed.js.map