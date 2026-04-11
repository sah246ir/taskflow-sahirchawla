import { ROUTES } from "@/config/routes";
import { HomeIcon, FolderIcon, ListChecksIcon, LogOutIcon } from "lucide-react";

export const SIDEBAR_ITEMS = [
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
            }
        ]
    }
]