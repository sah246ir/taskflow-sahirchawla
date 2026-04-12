import z from "zod"
import { TaskPriority, TaskStatus } from "@prisma/client"


export const listTasksQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),
  assignee: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  priority: z.enum(TaskPriority).optional(),
})

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional().nullable(),
})

export const taskIdParamSchema = z.object({
  id: z.string().uuid(),
})

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(TaskPriority).optional(),
    assignee_id: z.string().uuid().nullable().optional(),
    due_date: z
      .union([
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        z.null(),
      ])
      .optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined ||
      data.priority !== undefined ||
      data.assignee_id !== undefined ||
      data.due_date !== undefined,
    { message: "at least one field is required", path: ["title"] }
  )
