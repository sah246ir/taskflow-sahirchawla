import { PaginationQuery, PaginatedResponse } from "../types"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

export const getPaginationParams = (query: PaginationQuery) => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE)
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT))
  const skip = (page - 1) * limit

  return { page, limit, skip, take: limit }  // take is just limit, prisma uses "take"
}

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}