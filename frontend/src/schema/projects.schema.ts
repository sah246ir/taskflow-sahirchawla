import z from "zod"


export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

export const updateProjectSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  })
  .refine((d) => d.name !== undefined || d.description !== undefined, {
    message: "at least one of name or description",
  })

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>
export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>
