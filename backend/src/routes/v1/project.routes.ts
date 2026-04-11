import { Router } from "express"
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  listProjectsController,
  updateProjectController,
} from "../../controllers/project.controller"
import { createTaskController, listProjectTasksController } from "../../controllers/task.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { projectAccessMiddleware } from "../../middlewares/project.middleware"

export const projectRouter = Router()

projectRouter.use(authMiddleware)

projectRouter.get("/", listProjectsController)
projectRouter.post("/", createProjectController)
projectRouter.get("/:id", getProjectByIdController)
projectRouter.patch("/:id", updateProjectController)
projectRouter.delete("/:id", deleteProjectController)

projectRouter.get(
  "/:projectId/tasks",
  projectAccessMiddleware,
  listProjectTasksController
)
projectRouter.post(
  "/:projectId/tasks",
  projectAccessMiddleware,
  createTaskController
)
