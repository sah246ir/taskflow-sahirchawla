import axios from "axios"
import { ENV } from "../config/env"

/** Path prefix when `VITE_API_URL` is the server origin (e.g. `http://localhost:8000`). */
const API_V1 = "/api/v1/"

export const api = axios.create({
  baseURL: ENV.API_URL + API_V1,
})

// attach token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)
