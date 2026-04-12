import { prisma } from "../config"
import { AppError } from "../utils/error"
import { signJwtToken } from "../utils/jwt"
import { hashPassword, verifyPassword } from "../utils/password"

export const loginUser = async (
    email: string,
    password: string
) => {
    const userByEmail = await prisma.user.findFirst({
        where: {
            email
        }
    })
    if (!userByEmail) {
        throw new AppError(
            "UNAUTHORIZED",
            "Invalid credentials"
        )
    }
    const isPasswordValid = verifyPassword(password, userByEmail.password)
    if (!isPasswordValid) {
        throw new AppError(
            "UNAUTHORIZED",
            "Invalid credentials"
        )
    }
    const token = signJwtToken(
        userByEmail.id,
        userByEmail.email
    )
    return {
        token
    }
}

export const registerUser = async (
    name:string,
    email: string,
    password: string
) => {
    const userByEmail = await prisma.user.findFirst({
        where: {
            email,
        }
    })
    if (userByEmail) {
        throw new AppError(
            "CONFLICT",
            "User with this email already exists. try logging in"
        )
    }
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    })
    
    const token = signJwtToken(
        user.id,
        user.email
    )
    return {
        token
    }
}

export const getProfile = async (userId:string)=>{
    const userById = await prisma.user.findFirst({
        where: {
            id:userId,
        },
        select:{
            name:true,
            email:true,
            id:true
        }
    })
    if (!userById) throw new AppError('NOT_FOUND', 'user not found')
    return userById
}

export const getUsers = async (q:string) => {
    const users = await prisma.user.findMany({
        select:{
            name:true,
            email:true,
            id:true
        },
        where:{
            OR:[
                {name: {contains: q, mode: 'insensitive'}},
                {email: {contains: q, mode: 'insensitive'}}
            ]
        },
        take:20
    })
    return users
}

export const getUserStats = async (userId: string) => {
  const [todo, in_progress, done] = await Promise.all([
    prisma.task.count({ where: { assignee_id: userId, status: "todo" } }),
    prisma.task.count({ where: { assignee_id: userId, status: "in_progress" } }),
    prisma.task.count({ where: { assignee_id: userId, status: "done" } }),
  ])

  const assignedRows = await prisma.task.findMany({
    where: { assignee_id: userId },
    select: {
      project_id: true,
      status: true,
      project: { select: { id: true, name: true } },
    },
  })

  const byProjectMap = new Map<
    string,
    { projectId: string; projectName: string; todo: number; in_progress: number; done: number }
  >()
  for (const row of assignedRows) {
    const pid = row.project_id
    let entry = byProjectMap.get(pid)
    if (!entry) {
      entry = {
        projectId: row.project.id,
        projectName: row.project.name,
        todo: 0,
        in_progress: 0,
        done: 0,
      }
      byProjectMap.set(pid, entry)
    }
    if (row.status === "todo") entry.todo += 1
    else if (row.status === "in_progress") entry.in_progress += 1
    else if (row.status === "done") entry.done += 1
  }
  const byProject = Array.from(byProjectMap.values()).sort((a, b) =>
    a.projectName.localeCompare(b.projectName)
  )

  const recent5Tasks = await prisma.task.findMany({
    where: { assignee_id: userId },
    orderBy: { created_at: "desc" },
    take: 5,
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  })

  return {
    todo,
    in_progress,
    done,
    byProject,
    recent5Tasks,
  }
}