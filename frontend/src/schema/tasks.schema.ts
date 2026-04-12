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

  

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  due_date: z
    .string()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Invalid date",
    })
    .transform((v) => (v === "" ? undefined : v)),
})

export const updateTaskSchema = z
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

export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskPriority = z.infer<typeof taskPrioritySchema>
export type createTaskSchemaType = z.output<typeof createTaskSchema>
export type updateTaskSchemaType = z.output<typeof updateTaskSchema>