import {
  type createTaskSchemaType,
  type PaginationMeta,
  type updateTaskSchemaType,
} from "../schema/tasks.schema"
import type { TaskPriority, TaskStatus } from "../schema/common.schema"
import type { ApiResponse } from "../types/apiResponse"
import { api } from "./api"
import type { User } from "./auth.service"
import { cleanObject } from "@/utils/object"

export type TaskListData = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee_id: string
  due_date: string
  created_at: string
  updated_at: string
  assignee?: User | null
}[]
export type TaskListPayload = {
  tasks: TaskListData
  meta: PaginationMeta
}
export type ListTasksQuery = {
  status?: TaskStatus
  assignee?: string
  page?: number
  limit?: number
  priority?: TaskPriority
}
export async function listTasks(
  projectId: string,
  query?: ListTasksQuery
) {
  const { data } = await api.get<ApiResponse<TaskListPayload>>(`/projects/${projectId}/tasks`, {
    params: cleanObject(query),
  })
  return data
}

export async function createTask(
  projectId: string,
  body: createTaskSchemaType
){
  const { data } = await api.post<ApiResponse<TaskListData[number]>>(`/projects/${projectId}/tasks`, body)
  return data
}

export async function updateTask(
  taskId: string,
  body: updateTaskSchemaType
){
  const { data } = await api.patch<ApiResponse<TaskListData[number]>>(`/tasks/${taskId}`, body)
  return data
}

export async function deleteTask(taskId: string) {
  const { data } = await api.delete(`/tasks/${taskId}`)
  return data
}
