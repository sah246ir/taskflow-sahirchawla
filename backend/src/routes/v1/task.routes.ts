import { Router } from "express"
import { deleteTaskController, updateTaskController } from "../../controllers/task.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

export const taskRouter = Router()

taskRouter.use(authMiddleware)

taskRouter.patch("/:id", updateTaskController)
taskRouter.delete("/:id", deleteTaskController)
