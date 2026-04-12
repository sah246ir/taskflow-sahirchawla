import z from "zod"

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"])
export const taskPrioritySchema = z.enum(["low", "medium", "high"])
export const dateSchema = z
  .string()
  .transform((val) => (val === "" ? undefined : val))
  .optional().nullable()
  .refine(
    (val) => val === undefined || /^\d{4}-\d{2}-\d{2}$/.test(val),
    "Invalid date format"
  )

export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskPriority = z.infer<typeof taskPrioritySchema>