import {Router} from "express"
import { authRouter } from "./auth.routes"

export const v1Router = Router()

v1Router.post("auth/",authRouter)