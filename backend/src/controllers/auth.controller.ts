import { Request, Response } from "express"
import { loginSchema, registerSchema } from "../schema/auth.schema"
import { getProfile, loginUser, registerUser } from "../services/auth.service"
import { handleError } from "../utils/error"
import { successResponse } from "../utils/response"

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const data = await loginUser(email, password)
    res.status(200).json(successResponse(data))
  } catch (err) {
    handleError(err, res)
  }
}

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body)
    const data = await registerUser(name, email, password)
    res.status(201).json(successResponse(data))
  } catch (err) {
    handleError(err, res)
  }
}

export const meController = async (req: Request, res: Response) => {
  try {
    const data = await getProfile(req.user?.userId as string)
    res.status(200).json(successResponse(data))
  } catch (err) {
    handleError(err, res)
  }
}