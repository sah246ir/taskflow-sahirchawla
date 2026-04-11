import {Router} from "express"
import { loginController, meController, registerController } from "../../controllers/auth.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

export const authRouter = Router()

authRouter.post("/login",loginController)
authRouter.post("/register",registerController)
authRouter.get("/me",authMiddleware,meController)
