import {
  createTaskRequestSchema,
  updateTaskRequestSchema,
  type CreateTaskRequest,
  type ListTasksQuery,
  type Task,
  type TaskListData,
  type UpdateTaskRequest,
} from "../schema/tasks.schema"
import type { ApiResponse } from "../types/apiResponse"
import { api } from "./api"

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
  body: CreateTaskRequest
){
  createTaskRequestSchema.parse(body)
  const { data } = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, body)
  return data
}

export async function updateTask(
  taskId: string,
  body: UpdateTaskRequest
){
  updateTaskRequestSchema.parse(body)
  const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, body)
  return data
}

export async function deleteTask(taskId: string) {
  const { data } = await api.delete(`/tasks/${taskId}`)
  return data
}
