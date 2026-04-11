import {Request,Response} from "express"
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

export const handleError = (error:unknown,res:Response)=>{

}