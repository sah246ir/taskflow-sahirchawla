import React from 'react'
import { Outlet } from 'react-router-dom'
import { ProtectedLayout } from './ProtectedLayout'
import { Sidebar } from '@/components/ui/sidebar/Sidebar'
export const MainLayout = () => {
    return (
        <ProtectedLayout>

            <div className="flex p-4 gap-4">
                <Sidebar />
                <div className='grow'>
                    <Outlet />
                </div>
            </div>

        </ProtectedLayout>
    )
}
