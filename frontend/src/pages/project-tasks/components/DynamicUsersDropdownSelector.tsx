import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, Loader2Icon } from 'lucide-react'
import { getUsers, type User } from '@/services/auth.service'
import { Input } from '@/components/shadcn/input'

interface DynamicUsersDropdownSelectorProps {
  selectedUser: User | null
  onChange: (user: User) => void
  placeholder?: string
  disabled?: boolean
}

const DynamicUsersDropdownSelector = ({
  selectedUser,
  onChange,
  placeholder = 'Select assignee',
  disabled = false,
}: DynamicUsersDropdownSelectorProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', search],
    queryFn: () => getUsers(search),
    staleTime: 1000 * 60 * 5,
  })

  const users = data?.data ?? []
  const selected = selectedUser

  if (isLoading) {
    return (
      <div className="flex h-9 w-full items-center gap-2 rounded-md border border-input px-3 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin shrink-0" />
        Loading users...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-9 w-full items-center rounded-md border border-destructive px-3 text-sm text-destructive">
        Failed to load users
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors',
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !selected && 'text-muted-foreground'
          )}
        >
          <span className="truncate text-left">
            {selected ? (
              <>
                <span className="font-medium text-foreground">{selected.name}</span>
                <span className="text-muted-foreground"> · {selected.email}</span>
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={4} className="w-80 p-0">
        <Command>
            <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup heading="Users">
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.email}`}
                  keywords={[user.id]}
                  onSelect={() => {
                    onChange(user)
                    setOpen(false)
                  }}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default DynamicUsersDropdownSelector
