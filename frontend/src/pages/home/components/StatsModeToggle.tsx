import { Label } from '@/components/shadcn/label'
import { cn } from '@/lib/utils'

export type StatsMode = 'user' | 'project'

type StatsModeToggleProps = {
  value: StatsMode
  onChange: (mode: StatsMode) => void
  className?: string
}

export function StatsModeToggle({ value, onChange, className }: StatsModeToggleProps) {
  return (
    <fieldset className={cn('flex flex-wrap items-center gap-6', className)}>
      <legend className="sr-only">Statistics scope</legend>
      <div className="flex items-center gap-2">
        <input
          id="stats-mode-user"
          type="radio"
          name="stats-mode"
          className="size-4 accent-primary"
          checked={value === 'user'}
          onChange={() => onChange('user')}
        />
        <Label htmlFor="stats-mode-user" className="cursor-pointer font-normal">
          My tasks (user statistics)
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="stats-mode-project"
          type="radio"
          name="stats-mode"
          className="size-4 accent-primary"
          checked={value === 'project'}
          onChange={() => onChange('project')}
        />
        <Label htmlFor="stats-mode-project" className="cursor-pointer font-normal">
          Project statistics
        </Label>
      </div>
    </fieldset>
  )
}
