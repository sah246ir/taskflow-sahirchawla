import { Request, Response, NextFunction } from "express"
import { jwtPayloadSchema } from "../schema/auth.schema"
import { verifyJwtToken } from "../utils/jwt"
import { errorResponse } from "../utils/response"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json(errorResponse("unauthorized"))
  }
  try {
    const decoded = verifyJwtToken(token)
    const payload = jwtPayloadSchema.parse(decoded)
    req.user = payload
    return next()
  } catch {
    return res.status(401).json(errorResponse("unauthorized"))
  }
}