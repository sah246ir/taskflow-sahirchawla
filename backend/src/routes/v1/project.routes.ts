import { Router } from "express"
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectStatsController,
  getProjectUsersController,
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
projectRouter.get("/:projectId", getProjectByIdController)
projectRouter.get(
  "/:projectId/users",
  projectAccessMiddleware,
  getProjectUsersController
)
projectRouter.patch("/:projectId", updateProjectController)
projectRouter.delete("/:projectId", deleteProjectController)

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
projectRouter.get(
  "/:projectId/stats",
  projectAccessMiddleware,
  getProjectStatsController
)