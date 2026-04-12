import z from "zod"

export const projectIdParamSchema = z.object({
  projectId: z.string().uuid(),
})

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

export const updateProjectSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "at least one of name or description is required",
    path: ["name"],
  })
