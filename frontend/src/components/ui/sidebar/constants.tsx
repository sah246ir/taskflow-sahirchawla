import type { ReactNode } from "react";
import { ROUTES } from "@/config/routes";
import { HomeIcon, FolderIcon, ListChecksIcon, LogOutIcon } from "lucide-react";
import type { ProjectListData } from "@/services/projects.service";

export type SidebarNavEntry = {
    title: string;
    icon: ReactNode;
    href: string;
    onClick?: () => void;
    projects?: {
        title: string;
        description: string;
        href: string;
    }[];
};

export type SidebarItem = {
    title: string;
    items: SidebarNavEntry[];
};

export const SIDEBAR_ITEMS = (projects: ProjectListData[]): SidebarItem[] => [
    {
        title: 'Menu',
        items: [
            {
                title: 'Dashboard',
                icon: <HomeIcon className='w-4 h-4' />,
                href: ROUTES.HOME,
            },
            {
                title: 'Projects',
                icon: <FolderIcon className='w-4 h-4' />,
                href: ROUTES.PROJECTS,
                projects: projects.map((p) => ({
                    title: p.name,
                    description: p.description,
                    href: ROUTES.PROJECT_DETAIL.replace(':id', p.id),
                })),
            },
            {
                title: 'Tasks',
                icon: <ListChecksIcon className='w-4 h-4' />,
                href: ROUTES.PROJECT_DETAIL,
            },
        ]
    },
    {
        title: 'Account',
        items: [
            {
                title: 'Logout',
                icon: <LogOutIcon className='w-4 h-4' />,
                href: ROUTES.LOGIN,
                onClick: () => {
                    localStorage.removeItem('token')
                    window.location.href = ROUTES.LOGIN
                }
            }
        ]
    }
]