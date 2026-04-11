import {Request, Response, NextFunction} from "express"
import { verifyJwtToken } from "../utils/jwt";
import { errorResponse } from "../utils/response";
import { jwtPayloadSchema } from "../schema/auth.schema";

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(400).json(errorResponse("Unauthenticated"))
    }
    try{
        const decoded = verifyJwtToken(token);
        const payload = jwtPayloadSchema.parse(decoded);
        req.user = payload;
        next();
    }catch(error){
        return res.status(400).json(errorResponse("Invalid or malformed jwt token"))
    }
    
    next();
}