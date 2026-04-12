import { prisma } from "../config"

beforeAll(async () => {
  // clean db before all tests
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})