import z from "zod"

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
})

export type PaginationMeta = z.infer<typeof paginationMetaSchema>

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"])
export const taskPrioritySchema = z.enum(["low", "medium", "high"])

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  /** Omitted on nested tasks under `GET /projects/:id` in the current API. */
  project_id: z.string().uuid().optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  creator_id: z.string().uuid().nullable().optional(),
  due_date: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const taskListDataSchema = z.object({
  tasks: z.array(taskSchema),
  meta: paginationMetaSchema,
})

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  assignee: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

export const createTaskRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: taskPrioritySchema.optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
})

export const updateTaskRequestSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    assignee_id: z.string().uuid().nullable().optional(),
    due_date: z
      .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()])
      .optional(),
  })
  .refine(
    (d) =>
      d.title !== undefined ||
      d.description !== undefined ||
      d.status !== undefined ||
      d.priority !== undefined ||
      d.assignee_id !== undefined ||
      d.due_date !== undefined,
    { message: "at least one field" }
  )

export type Task = z.infer<typeof taskSchema>
export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskPriority = z.infer<typeof taskPrioritySchema>
export type TaskListData = z.infer<typeof taskListDataSchema>
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>
export type UpdateTaskRequest = z.infer<typeof updateTaskRequestSchema>
