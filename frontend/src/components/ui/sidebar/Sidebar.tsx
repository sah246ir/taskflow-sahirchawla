import logo from '@/assets/logo.png'
import { CardWrapper } from '../wrappers/CardWrapper'
import { Typeface } from '../typeface'
import { SIDEBAR_ITEMS } from './constants'
import { SidebarLink } from './actions/SidebarLink'
import { ProjectsSidebarPopover } from './actions/ProjectsSidebarPopover'
import { useQuery } from '@tanstack/react-query'
import { listProjects } from '@/services/projects.service'

export const Sidebar = () => {
  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(),
  })
  return (
    <div className='flex flex-col gap-4 h-[calc(100vh-35px)] min-w-48'>
      <CardWrapper className='p-4'>
        <img src={logo} alt="logo" width={115} className='mx-auto' />
      </CardWrapper>

      <CardWrapper className='p-0 py-2 h-full flex-1 flex flex-col gap-8'>
        {SIDEBAR_ITEMS(data?.data?.projects ?? []).map((item) => (
          <div key={item.title}>
            <Typeface className='px-2 pb-1 border-b border-gray-200 mb-1' color='secondary' size='sm' as='h1' variant='regular'>
              {item.title}
            </Typeface>
            <div className="p-3">
              {item.items.map((link) =>
                link.title === 'Projects' ? (
                  <ProjectsSidebarPopover key={link.title} item={link} />
                ) : (
                  <SidebarLink key={link.title} title={link.title} href={link.href} icon={link.icon} />
                )
              )}
            </div>
          </div>
        ))}
      </CardWrapper>
    </div>
  )
}
