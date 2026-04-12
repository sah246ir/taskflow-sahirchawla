import { Outlet } from 'react-router-dom'
import { ProtectedLayout } from './ProtectedLayout'
import { Sidebar } from '@/components/ui/sidebar/Sidebar'
export const MainLayout = () => {
    return (
        <ProtectedLayout>

            <div className="flex gap-4 p-4">
                <Sidebar />
                <div className="min-w-0 grow pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:pb-0">
                    <Outlet />
                </div>
            </div>

        </ProtectedLayout>
    )
}
