export type PaginationQuery = {
    page: number
    limit: number
  }

export type PaginationMeta = {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}