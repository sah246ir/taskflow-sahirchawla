import { Request, Response } from "express"
import {
  createProjectSchema,
  listProjectsQuerySchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "../schema/project.schema"
import {
  createProject,
  DeleteProject,
  getProjectById,
  getProjects,
  UpdateProject,
} from "../services/project.service"
import { handleError } from "../utils/error"
import { successResponse } from "../utils/response"

export const listProjectsController = async (req: Request, res: Response) => {
  try {
    const query = listProjectsQuerySchema.parse(req.query)
    const result = await getProjects(req.user!.userId, { pagination: query })
    res.status(200).json(
      successResponse({
        projects: result.data,
        meta: result.meta,
      })
    )
  } catch (err) {
    handleError(err, res)
  }
}

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const body = createProjectSchema.parse(req.body)
    const project = await createProject(
      req.user!.userId,
      body.name,
      body.description ?? ""
    )
    res.status(201).json(successResponse(project))
  } catch (err) {
    handleError(err, res)
  }
}

export const getProjectByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = projectIdParamSchema.parse(req.params)
    const project = await getProjectById(req.user!.userId, id)
    res.status(200).json(successResponse(project))
  } catch (err) {
    handleError(err, res)
  }
}

export const updateProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = projectIdParamSchema.parse(req.params)
    const body = updateProjectSchema.parse(req.body)
    const project = await UpdateProject(
      req.user!.userId,
      id,
      body.name,
      body.description
    )
    res.status(200).json(successResponse(project))
  } catch (err) {
    handleError(err, res)
  }
}

export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = projectIdParamSchema.parse(req.params)
    await DeleteProject(req.user!.userId, id)
    res.status(204).send()
  } catch (err) {
    handleError(err, res)
  }
}
