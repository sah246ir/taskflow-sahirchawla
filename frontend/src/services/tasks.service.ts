import {
  createTaskSchema,
  updateTaskSchema,
  type createTaskSchemaType,
  type updateTaskSchemaType,
} from "../schema/tasks.schema"
import type { ApiResponse } from "../types/apiResponse"
import { api } from "./api"

type TaskListData = {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignee_id: string
  due_date: string
}[]
type ListTasksQuery = {
  status?: string
  assignee?: string
  page?: number
  limit?: number
}
export async function listTasks(
  projectId: string,
  query?: ListTasksQuery
) {
  const { data } = await api.get<ApiResponse<TaskListData>>(`/projects/${projectId}/tasks`, {
    params: query,
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
