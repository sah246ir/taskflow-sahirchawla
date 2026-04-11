import { Router } from "express"
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  listProjectsController,
  updateProjectController,
} from "../../controllers/project.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"

export const projectRouter = Router()

projectRouter.use(authMiddleware)

projectRouter.get("/", listProjectsController)
projectRouter.post("/", createProjectController)
projectRouter.get("/:id", getProjectByIdController)
projectRouter.patch("/:id", updateProjectController)
projectRouter.delete("/:id", deleteProjectController)
