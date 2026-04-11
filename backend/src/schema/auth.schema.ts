import z from "zod";

export const jwtPayloadSchema = z.object({
    userId: z.string(),
    email: z.string()
})
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8)
})
export type RegisterSchema = z.infer<typeof registerSchema>;