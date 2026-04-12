import z from "zod"
import { dateSchema, taskPrioritySchema, taskStatusSchema } from "./common.schema"

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
})

export type PaginationMeta = z.infer<typeof paginationMetaSchema>

  

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().nullable().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignee_id: z.string().nullable().optional(),
  due_date: dateSchema
})

export const updateTaskSchema = createTaskSchema.partial()

export type createTaskSchemaType = z.output<typeof createTaskSchema>
export type updateTaskSchemaType = z.output<typeof updateTaskSchema>
