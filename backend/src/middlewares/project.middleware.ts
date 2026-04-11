import { NextFunction, Request, Response } from "express"
import { prisma } from "../config"
import { AppError } from "../utils/error"
import { errorResponse } from "../utils/response"

export const projectAccessMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const { projectId } = req.params as { projectId?: string }
    if (!projectId) {
      throw new AppError("VALIDATION_ERROR", "Project ID is required for this route")
    }

    const userId = req.user!.userId
    const project = await prisma.project.findFirst({
      where: {
        OR: [
          { id: projectId, owner_id: userId },
          {
            id: projectId,
            tasks: { some: { assignee_id: userId } },
          },
        ],
      },
      select: { id: true, owner_id: true },
    })
    if (!project) {
      return res.status(403).json(errorResponse("forbidden"))
    }
    next()
  }