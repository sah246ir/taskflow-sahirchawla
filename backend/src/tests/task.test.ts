import request from "supertest"
import { app } from "../app"

// helper to get token
const getToken = async () => {
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "test@example.com", password: "password123" })
  return res.body.token
}

const getProjectId = async (token: string) => {
  const res = await request(app)
    .post("/api/v1/projects")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test Project" })
  return res.body.id
}

describe("POST /api/v1/projects/:id/tasks", () => {
  let token: string
  let projectId: string

  beforeAll(async () => {
    token = await getToken()
    projectId = await getProjectId(token)
  })

  it("should create a task", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", priority: "high" })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe("Test Task")
    expect(res.body.status).toBe("todo")
  })

  it("should return 400 if title missing", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ priority: "high" })

    expect(res.status).toBe(400)
    expect(res.body.fields.title).toBeDefined()
  })

  it("should return 401 if no token", async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .send({ title: "Test Task" })

    expect(res.status).toBe(401)
  })
})