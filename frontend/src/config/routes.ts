export const ROUTES = {
    LOGIN: "/login",
    HOME: "/home",
    REGISTER: "/register",
    PROJECTS: "/projects",
    PROJECT_DETAIL: "/projects/:id",
  } as const
  
  // helper for dynamic routes
  export const toProjectDetail = (id: string) => ROUTES.PROJECT_DETAIL.replace(":id", id)