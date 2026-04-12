import logo from '@/assets/logo.png'
import { CardWrapper } from '../wrappers/CardWrapper'
import { Typeface } from '../typeface'
import { SIDEBAR_ITEMS, flattenSidebarNavEntries } from './constants'
import { SidebarLink } from './actions/SidebarLink'
import { ProjectsSidebarPopover } from './actions/ProjectsSidebarPopover'
import { useQuery } from '@tanstack/react-query'
import { listProjects } from '@/services/projects.service'

export const Sidebar = () => {
  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects(),
  })
  const sections = SIDEBAR_ITEMS(data?.data?.projects ?? [])
  const mobileNavEntries = flattenSidebarNavEntries(sections)

  return (
    <>
      <div className="hidden min-h-0 min-w-48 flex-col gap-4 sm:flex h-[calc(100vh-35px)]">
        <CardWrapper className="p-4">
          <img src={logo} alt="logo" width={115} className="mx-auto" />
        </CardWrapper>

        <CardWrapper className="flex h-full flex-1 flex-col gap-8 p-0 py-2">
          {sections.map((item) => (
            <div key={item.title}>
              <Typeface
                className="mb-1 border-b border-gray-200 px-2 pb-1"
                color="secondary"
                size="sm"
                as="h1"
                variant="regular"
              >
                {item.title}
              </Typeface>
              <div className="p-3">
                {item.items.map((link) =>
                  link.title === 'Projects' ? (
                    <ProjectsSidebarPopover key={link.title} item={link} />
                  ) : (
                    <SidebarLink
                      key={link.title}
                      title={link.title}
                      href={link.href}
                      icon={link.icon}
                      onClick={link.onClick}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </CardWrapper>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-border bg-white pb-[env(safe-area-inset-bottom,0px)] sm:hidden"
        aria-label="Primary"
      >
        {mobileNavEntries.map((entry) =>
          entry.title === 'Projects' ? (
            <ProjectsSidebarPopover
              key={entry.title}
              item={entry}
              side="top"
              variant="bottomBar"
            />
          ) : (
            <SidebarLink
              key={entry.title}
              title={entry.title}
              href={entry.href}
              icon={entry.icon}
              onClick={entry.onClick}
              variant="bottomBar"
            />
          )
        )}
      </nav>
    </>
  )
}
