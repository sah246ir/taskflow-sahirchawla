import React, { useState } from 'react'
import { Typeface } from '../../typeface'
import { cn } from '@/lib/utils'
import type { SidebarNavEntry } from '../constants'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRightIcon, Plus } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn/command'
import { CreateProjectDialog } from '@/pages/projects/components/CreateProjectDialog'

export type SidebarButtonProps = {
  active?: boolean
  item: SidebarNavEntry
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'>

export const SidebarButton = ({
  item,
  className,
  type = 'button',
  ...props
}: SidebarButtonProps) => {
  const navigate = useNavigate()
  const { title, icon } = item
  const active = useLocation().pathname === item.href
  const projects = item.projects ?? []
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false)
  return (
    <>
    <CreateProjectDialog isOpen={createProjectDialogOpen} setOpen={setCreateProjectDialogOpen} />
    <div className="">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type={type}
            className={cn(
              'flex w-full items-center justify-between gap-2 rounded-md mb-1 p-2 text-left',
              active ? 'bg-blue-50 text-blue-800' : 'hover:bg-blue-50/50',
              className
            )}
            {...props}
          >
            <Typeface size='sm' as='p' variant='regular' className='flex items-center gap-2 text-inherit'>
              <span>{icon}</span>
              {title}
            </Typeface>
            <ChevronRightIcon className='w-4 h-4 shrink-0' />
          </button>
        </PopoverTrigger>
        <PopoverContent sideOffset={15} side='right' align='start' className='w-80 p-0'>
          <Command>
            <CommandInput placeholder="Search projects…" />
            <CommandList>
              <CommandEmpty>No projects found.</CommandEmpty>
              <CommandGroup heading="Projects">
                {projects.map((project) => (
                  <CommandItem
                    key={project.title}
                    value={`${project.title} ${project.description}`}
                    onSelect={() => {
                      navigate(project.href)
                    }}
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-medium">{project.title}</span>
                      <span className="truncate text-xs text-muted-foreground">{project.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <button onClick={() => setCreateProjectDialogOpen(true)} className='flex items-center gap-2 p-2 hover:bg-hover-action-background-faded cursor-pointer'>
              <Plus className='w-4 h-4 text-muted-foreground' />
              <Typeface as='span' size='sm' variant='regular' color='muted'>
                New Project
              </Typeface>
            </button>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
    </>
  )
}
