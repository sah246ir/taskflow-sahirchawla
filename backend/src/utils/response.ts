export const successResponse = (data: any) => {
    return {
        success: true,
        data
    }
}

export const errorResponse = (message: string,context?: Record<string,any>) => {
    return {
        error: message,
        ...(context ? context : {})
    }
}