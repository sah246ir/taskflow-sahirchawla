import {
  type LoginSchemaType,
  type RegisterSchemaType,
} from "../schema/auth.schema"
import type { ApiResponse } from "../types/apiResponse"
import { api } from "./api"

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

type User = {
  id: string
  name: string
  email: string
}
export async function getMe(): Promise<ApiResponse<User>> {
  const { data } = await api.get<ApiResponse<User>>("/auth/me")
  return data
}
