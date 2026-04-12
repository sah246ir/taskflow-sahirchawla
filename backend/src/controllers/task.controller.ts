import { Request, Response } from "express"
import { TaskPriority, TaskStatus } from "../generated/prisma/client"
import {
  createTaskSchema,
  listTasksQuerySchema,
  projectIdParamSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../schema/task.schema"
import { createTask, deleteTask, listTasks, updateTask } from "../services/task.service"
import { handleError } from "../utils/error"
import { successResponse } from "../utils/response"

const toUtcDateOnly = (s: string) => new Date(`${s}T00:00:00.000Z`)

export const listProjectTasksController = async (req: Request, res: Response) => {
  try {
    const { projectId } = projectIdParamSchema.parse(req.params)
    const query = listTasksQuerySchema.parse(req.query)
    const result = await listTasks(req.user!.userId, projectId, {
      filters: {
        status: query.status,
        assignee: query.assignee,
      },
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    })
    res.status(200).json(
      successResponse({
        tasks: result.data,
        meta: result.meta,
      })
    )
  } catch (err) {
    handleError(err, res)
  }
}

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { projectId } = projectIdParamSchema.parse(req.params)
    const body = createTaskSchema.parse(req.body)
    const task = await createTask(req.user!.userId, projectId, {
      title: body.title,
      description: body.description,
      status: body.status ?? TaskStatus.todo,
      priority: body.priority ?? TaskPriority.medium,
      assignee_id: body.assignee_id,
      due_date: body.due_date ? toUtcDateOnly(body.due_date) : undefined,
    })
    res.status(201).json(successResponse(task))
  } catch (err) {
    handleError(err, res)
  }
}

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = taskIdParamSchema.parse(req.params)
    const body = updateTaskSchema.parse(req.body)
    const task = await updateTask(req.user!.userId, id, {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      assignee_id: body.assignee_id,
      due_date:
        body.due_date === undefined
          ? undefined
          : body.due_date === null
            ? null
            : toUtcDateOnly(body.due_date),
    })
    res.status(200).json(successResponse(task))
  } catch (err) {
    handleError(err, res)
  }
}

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = taskIdParamSchema.parse(req.params)
    await deleteTask(req.user!.userId, id)
    res.status(204).send()
  } catch (err) {
    handleError(err, res)
  }
}
