import {Request, Response, NextFunction} from "express"
import { verifyJwtToken } from "../utils/jwt"
import { jwtPayloadSchema } from "../schema/auth.schema"

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({ error: "unauthorized" })
    }
    try{
        const decoded = verifyJwtToken(token);
        const payload = jwtPayloadSchema.parse(decoded);
        req.user = payload;
        return next();
    }catch(error){
        return res.status(401).json({ error: "unauthorized" })
    }
}