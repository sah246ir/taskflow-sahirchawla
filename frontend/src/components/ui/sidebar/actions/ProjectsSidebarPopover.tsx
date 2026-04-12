import React, { useState } from 'react'
import { Typeface } from '../../typeface'
import { cn } from '@/lib/utils'
import type { SidebarNavEntry } from '../constants'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronRightIcon, LayoutList, PencilIcon, Plus, TrashIcon } from 'lucide-react'
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
import { deleteProject} from '@/services/projects.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/config/queryClient'
import { toast } from 'sonner'
import { ConfirmDialog } from '../../dialogs/ConfirmDialog'
import { ROUTES } from '@/config/routes'

export type SidebarButtonProps = {
  active?: boolean
  item: SidebarNavEntry
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'>

export const ProjectsSidebarPopover = ({
  item,
  className,
  type = 'button',
  ...props
}: SidebarButtonProps) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const { title, icon } = item
  const active = useLocation().pathname === item.href
  const projects = item.projects ?? []
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false)
  
  const [projectAction, setProjectAction] = useState<{action: 'delete' | 'edit', project: SidebarNavEntry["projects"][number]} | null>(null)
  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      if (id === projectAction?.project.id) {
        navigate(ROUTES.PROJECTS)
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setProjectAction(null)
      toast.success("Project deleted successfully")
    },
    onError: () => {
    }
  })


  return (
    <>
    <div className="">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                <div className="max-h-[185px] overflow-y-auto">
                  {projects.map((project) => (
                    <CommandItem
                      key={project.title}
                      value={`${project.title} ${project.description}`}
                      onSelect={() => {
                        setPopoverOpen(false)
                        navigate(project.href)
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate font-medium">{project.title}</span>
                          <span className="truncate text-xs text-muted-foreground">{project.description}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                          className='cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectAction({action: 'edit', project})
                          }}>
                            <PencilIcon className='w-4 h-4 text-blue-600' />
                          </button>
                          <button
                          className='cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectAction({action: 'delete', project})
                          }}>
                            <TrashIcon className='w-4 h-4 text-destructive' />
                          </button>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
            <div className="border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setPopoverOpen(false)
                  navigate(ROUTES.PROJECTS)
                }}
                className="flex w-full cursor-pointer items-center gap-2 p-2 hover:bg-hover-action-background-faded"
              >
                <LayoutList className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Typeface as="span" size="sm" variant="regular" color="muted">
                  View all projects
                </Typeface>
              </button>
              <button
                type="button"
                onClick={() => setCreateProjectDialogOpen(true)}
                className="flex w-full cursor-pointer items-center gap-2 border-t border-border p-2 hover:bg-hover-action-background-faded"
              >
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Typeface as="span" size="sm" variant="regular" color="muted">
                  New Project
                </Typeface>
              </button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <ConfirmDialog
        isOpen={projectAction?.action === 'delete'}
        setOpen={() => setProjectAction(null)}
        onCancel={() => setProjectAction(null)}
        onConfirm={() => {
          deleteMutation.mutate(projectAction.project.id)
        }}
        title="Delete Project"
        description="Are you sure you want to delete this project?"
        confirmText="Delete"
      >
        Are you sure you want to delete this project?
        all the associated data will also be deleted.
      </ConfirmDialog>
    <CreateProjectDialog 
    isOpen={createProjectDialogOpen || projectAction?.action === 'edit'}  
    setOpen={()=>{
      setCreateProjectDialogOpen(false)
      setProjectAction(null)
    }} 
    id={projectAction?.project?.id}
    initialValues={projectAction?.project ? { name: projectAction.project.title, description: projectAction.project.description } : undefined}
    />

    </div>
    </>
  )
}
