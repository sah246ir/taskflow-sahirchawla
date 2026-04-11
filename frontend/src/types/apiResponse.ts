export type ApiResponse<T> = {
  success: true
  data: T
}

/** Error JSON from the API (`errorResponse` / `handleError`). */
export type ApiErrorResponse = {
  error: string
  fields?: Record<string, string>
}
