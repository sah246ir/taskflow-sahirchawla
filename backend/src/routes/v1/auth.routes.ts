import {Router} from "express"
import { getUsersController, loginController, meController, registerController } from "../../controllers/auth.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

export const authRouter = Router()

authRouter.post("/login",loginController)
authRouter.post("/register",registerController)
authRouter.get("/me",authMiddleware,meController)
authRouter.get("/users",authMiddleware,getUsersController)
