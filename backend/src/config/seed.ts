import { hashPassword } from "../utils/password"
import { prisma } from "./prisma"

export const seed = async () => {
    const password = await hashPassword("password123")
    await prisma.user.create({
        data: {
            name: "John Doe",
            email: "test@example.com",
            password: password
        }
    })
    console.log("User created")
    console.log("Email: ", "test@example.com")
    console.log("Password: ", password)
}

seed().then(() => {
    console.log("Seed completed")
}).catch(console.error)