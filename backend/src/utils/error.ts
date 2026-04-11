import { Response } from "express"
import { ZodError } from "zod"
import { errorResponse } from "./response"
export type ErrorCode =
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'UNAUTHORIZED'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'

export interface ErrorMeta {
  [key: string]: unknown            // anything else you want to attach
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public meta?: ErrorMeta         // optional metadata
  ) {
    super(message)
  }
}

export const statusFromCode: Record<ErrorCode, number> = {
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  VALIDATION_ERROR: 400,
}

const zodToFieldErrors = (err: ZodError): Record<string, string> => {
  const fields: Record<string, string> = {}
  for (const issue of err.issues) {
    const path = issue.path.join(".") || "_root"
    if (!fields[path]) {
      fields[path] = issue.message
    }
  }
  return fields
}

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json(errorResponse("validation failed", { fields: zodToFieldErrors(error) }))
  }
  if (error instanceof AppError) {
    const status = statusFromCode[error.code]
    if (error.code === "VALIDATION_ERROR" && error.meta?.fields) {
      return res.status(status).json(
        errorResponse("validation failed", {
          fields: error.meta.fields as Record<string, string>,
        })
      )
    }
    if (error.code === "NOT_FOUND") {
      return res.status(status).json(errorResponse("not found"))
    }
    if (error.code === "UNAUTHORIZED") {
      return res.status(status).json(errorResponse("unauthorized"))
    }
    if (error.code === "FORBIDDEN") {
      return res.status(status).json(errorResponse("forbidden"))
    }
    return res.status(status).json(errorResponse(error.message))
  }
  console.error(error)
  return res.status(500).json(errorResponse("internal server error"))
}