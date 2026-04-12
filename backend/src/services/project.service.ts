import { prisma } from "../config"
import { PaginationQuery } from "../types"
import { AppError } from "../utils/error"
import { buildPaginatedResponse, getPaginationParams } from "../utils/pagination"

export const getProjects = async(
    userId:string,
    options:{
        pagination:PaginationQuery
    }
)=>{
    const {limit,page,skip,take} = getPaginationParams(options.pagination)
    const where = {
        OR:[
            {
                owner_id:userId
            },
            {
                tasks:{
                    some:{
                        assignee_id:userId
                    }
                }
            }
        ]
    }
    const projects = await prisma.project.findMany({
        where:where,
        select:{
            name:true,
            description:true,
            id:true,
            owner_id:true,
            created_at:true
        },
        skip,
        take,
    })
    const total = await prisma.project.count({
        where:where
    })


    return buildPaginatedResponse<typeof projects[number]>(
        projects,
        total,
        page,
        limit
    )
}

export const getProjectById = async(
    userId:string,
    projectId:string,
)=>{
    const where = {
        OR:[
            {
                id:projectId,
                owner_id:userId
            },
            {
                id:projectId,
                tasks:{
                    some:{
                        assignee_id:userId
                    }
                }
            }
        ]
    }
    const project = await prisma.project.findFirst({
        where:where,
        select:{
            id:true,
            name:true,
            description:true,
            owner_id:true,
            created_at:true,
            tasks:{
                select:{
                    id:true,
                    title:true,
                    description:true,
                    status:true,
                    priority:true,
                    assignee_id:true,
                    due_date:true,
                    created_at:true,
                    updated_at:true
                }
            }
        }
    }) 
    if(!project){
        throw new AppError(
            "NOT_FOUND",
            "Project not found"
        )
    }
    
    return project
}

export const createProject = async(
    userId:string,
    name:string,
    description:string
)=>{
    const existingproject = await prisma.project.findFirst({
        where:{
            name,
            owner_id:userId
        }
    })
    if(existingproject){
        throw new AppError(
            "CONFLICT",
            "Project with this name already exists"
        )
    }
    const project = await prisma.project.create({
        data:{
            name,
            description,
            owner_id:userId
        }
    })

    return project
}

export const UpdateProject = async(
    userId:string,
    projectId:string,
    name?:string,
    description?:string
)=>{
    const project = await prisma.project.findFirst({
        where:{
            owner_id:userId,
            id:projectId
        }
    }) 
    if(!project){
        throw new AppError(
            "NOT_FOUND",
            "Project not found"
        )
    }
    const newproject = await prisma.project.update({
        where:{
            owner_id:userId,
            id:projectId
        },
        data:{
            ...(name?{name}:{}),
            ...(description?{description}:{}),
        }
    })

    return newproject
}

export const DeleteProject = async(
    userId:string,
    projectId:string, 
)=>{
    const project = await prisma.project.findFirst({
        where:{
            owner_id:userId,
            id:projectId
        }
    }) 
    if(!project){
        throw new AppError(
            "NOT_FOUND",
            "Project not found"
        )
    }
    await prisma.project.delete({
        where:{
            owner_id:userId,
            id:projectId
        }
    })

    return true
}

export const getProjectUsers = async(
    projectId:string,
)=>{
    const users = await prisma.user.findMany({
        where:{
            assigned_tasks:{
                some:{
                    project_id:projectId
                }
            }
        }
    })
    return users
}