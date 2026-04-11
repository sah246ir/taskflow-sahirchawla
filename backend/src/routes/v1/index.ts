import { Router } from "express"
import { authRouter } from "./auth.routes"
import { projectRouter } from "./project.routes"
import { taskRouter } from "./task.routes"

export const v1Router = Router()

v1Router.use("/auth", authRouter)
v1Router.use("/projects", projectRouter)
v1Router.use("/tasks", taskRouter)