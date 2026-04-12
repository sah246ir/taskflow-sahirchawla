import {
  type LoginSchemaType,
  type RegisterSchemaType,
} from "../schema/auth.schema"
import type { ApiResponse } from "../types/apiResponse"
import { api } from "./api"
import type { TaskListData } from "./tasks.service"

type AuthTokenData = {
  token: string
}
export async function login(body: LoginSchemaType): Promise<ApiResponse<AuthTokenData>> {
  const { data } = await api.post<ApiResponse<AuthTokenData>>("/auth/login", body)
  return data
}


export async function register(body: RegisterSchemaType): Promise<ApiResponse<AuthTokenData>> {
  const { data } = await api.post<ApiResponse<AuthTokenData>>("/auth/register", body)
  return data
}

export type User = {
  id: string
  name: string
  email: string
}
export async function getMe(): Promise<ApiResponse<User>> {
  const { data } = await api.get<ApiResponse<User>>("/auth/me")
  return data
}

export async function getUsers(q:string): Promise<ApiResponse<User[]>> {
  const { data } = await api.get<ApiResponse<User[]>>("/auth/users", {
    params: { q }
  })
  return data
}

export type UserStatsByProject = {
  projectId: string
  projectName: string
  todo: number
  in_progress: number
  done: number
}

export type UserStats = {
  todo: number
  in_progress: number
  done: number
  byProject: UserStatsByProject[]
  recent5Tasks: TaskListData
}

export async function getUserStats() {
  const { data } = await api.get<ApiResponse<UserStats>>("/auth/stats")
  return data
}
