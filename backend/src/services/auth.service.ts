import { prisma } from "../config"
import { AppError } from "../utils/error"
import { signJwtToken } from "../utils/jwt"
import { hashPassword, verifyPassword } from "../utils/password"

export const loginUser = async (
    email: string,
    password: string
) => {
    const userByEmail = await prisma.user.findFirst({
        where: {
            email
        }
    })
    if (!userByEmail) {
        throw new AppError(
            "UNAUTHORIZED",
            "Invalid credentials"
        )
    }
    const isPasswordValid = verifyPassword(password, userByEmail.password)
    if (!isPasswordValid) {
        throw new AppError(
            "UNAUTHORIZED",
            "Invalid credentials"
        )
    }
    const token = signJwtToken(
        userByEmail.id,
        userByEmail.email
    )
    return {
        token
    }
}

export const registerUser = async (
    name:string,
    email: string,
    password: string
) => {
    const userByEmail = await prisma.user.findFirst({
        where: {
            email,
        }
    })
    if (userByEmail) {
        throw new AppError(
            "CONFLICT",
            "User with this email already exists. try logging in"
        )
    }
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    })
    
    const token = signJwtToken(
        user.id,
        user.email
    )
    return {
        token
    }
}

export const getProfile = async (userId:string)=>{
    const userById = await prisma.user.findFirst({
        where: {
            id:userId,
        },
        select:{
            name:true,
            email:true,
            id:true
        }
    })
    if (!userById) throw new AppError('NOT_FOUND', 'user not found')
    return userById
}