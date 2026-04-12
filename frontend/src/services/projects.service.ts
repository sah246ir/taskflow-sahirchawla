import type { PaginationQuery } from "@/types/types"
import {
  type CreateProjectSchemaType,
  type UpdateProjectSchemaType,
} from "../schema/projects.schema"
import type { ApiResponse } from "../types/apiResponse"
import { api } from "./api"
import type { User } from "./auth.service"

export type ProjectListData = {
  id: string
  name: string
  description: string
  owner_id: string
  created_at: string
}

export type ProjectListPayload = {
  projects: ProjectListData[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function listProjects(query?: PaginationQuery) {
  const { data } = await api.get<ApiResponse<ProjectListPayload>>("/projects", {
    params: query,
  })
  return data
}

type ProjectDetail = {
  id: string
  name: string
  description: string
  owner_id: string
  created_at: string
}
export async function getProject(id: string){
  const { data } = await api.get<ApiResponse<ProjectDetail>>(`/projects/${id}`)
  return data
}

export async function createProject(
  body: CreateProjectSchemaType
) {
  const { data } = await api.post<ApiResponse<ProjectDetail>>("/projects", body)
  return data
}

export async function updateProject(
  id: string,
  body: UpdateProjectSchemaType
){
  const { data } = await api.patch<ApiResponse<ProjectDetail>>(`/projects/${id}`, body)
  return data
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`)
}

export async function getProjectUsers(projectId: string) {
  const { data } = await api.get<ApiResponse<User[]>>(`/projects/${projectId}/users`)
  return data
}