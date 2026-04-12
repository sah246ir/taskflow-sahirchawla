import request from "supertest"
import { prisma } from "../config"
import { app } from "../app"

describe("POST /api/v1/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "password123" })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("token")
    expect(res.body.user.email).toBe("test@example.com")
    expect(res.body.user).not.toHaveProperty("password")
  })

  it("should return 409 if email already exists", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test User", email: "dupe@example.com", password: "password123" })

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Test User", email: "dupe@example.com", password: "password123" })

    expect(res.status).toBe(409)
    expect(res.body).toHaveProperty("error")
  })

  it("should return 400 if fields missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@example.com" })  // missing name and password

    expect(res.status).toBe(400)
    expect(res.body.fields).toBeDefined()
  })
})

describe("POST /api/v1/auth/login", () => {
  it("should login and return token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password123" })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("token")
  })

  it("should return 401 on wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" })

    expect(res.status).toBe(401)
  })

  it("should return 404 if user not found", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nobody@example.com", password: "password123" })

    expect(res.status).toBe(404)
  })
})