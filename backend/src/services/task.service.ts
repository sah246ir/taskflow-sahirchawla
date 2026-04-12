import { prisma } from "../config"
import { TaskPriority, TaskStatus } from "../generated/prisma/client"
import { PaginationQuery } from "../types"
import { AppError } from "../utils/error"
import { buildPaginatedResponse, getPaginationParams } from "../utils/pagination"

const getTaskProjectById = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  })
  if (!task) {
    throw new AppError("NOT_FOUND", "Task not found")
  }
  return task
}

export const listTasks = async (
  userId: string,
  projectId: string,
  options: {
    filters: { status?: TaskStatus; assignee?: string; priority?: TaskPriority }
    pagination: PaginationQuery
  }
) => {
  const { limit, page, skip, take } = getPaginationParams(options.pagination)
  const where = {
    project_id: projectId,
    ...(options.filters.status ? { status: options.filters.status } : {}),
    ...(options.filters.assignee ? { assignee_id: options.filters.assignee } : {}),
    ...(options.filters.priority ? { priority: options.filters.priority } : {}),
  }
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { created_at: "asc" },
    skip,
    take,
    include:{
      assignee:{
        select:{
          id:true,
          name:true,
          email:true,
        },
      },
    }
  })
  const total = await prisma.task.count({ where })

  return buildPaginatedResponse<typeof tasks[number]>(tasks, total, page, limit)
}

export const createTask = async (
  userId: string,
  projectId: string,
  input: {
    title: string
    description?: string
    status?: TaskStatus
    priority: TaskPriority
    assignee_id?: string | null
    due_date?: Date | null
  }
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })
  const isOwner = project?.owner_id === userId
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? TaskStatus.todo,
      priority: input.priority,
      project_id: projectId,
      assignee_id: isOwner?input.assignee_id || userId:userId,
      due_date: input.due_date ?? undefined,
      creator_id: userId,
    },
  })
}


export const updateTask = async (
  userId: string,
  taskId: string,
  input: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    assignee_id?: string | null
    due_date?: Date | null
  }
) => {
  const task = await getTaskProjectById(taskId)

  const isOwner = task.project.owner_id === userId
  const isAssignee = task.assignee_id === userId
  const isCreator = task.creator_id === userId
  if (!isOwner && !isAssignee && !isCreator) {
    throw new AppError("FORBIDDEN", "Cannot update this task")
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.assignee_id !== undefined ? { assignee_id: input.assignee_id } : {}),
      ...(input.due_date !== undefined ? { due_date: input.due_date } : {}),
    },
  })
}

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await getTaskProjectById(taskId)
  const isOwner = task.project.owner_id === userId
  const isCreator = task.creator_id === userId
  if (!isOwner && !isCreator) {
    throw new AppError("FORBIDDEN", "Cannot delete this task")
  }
  await prisma.task.delete({
    where: { id: taskId },
  })
  return true
}
