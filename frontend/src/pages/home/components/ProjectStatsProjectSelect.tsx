import { Label } from '@/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import type { ProjectListData } from '@/services/projects.service'

type ProjectStatsProjectSelectProps = {
  projects: ProjectListData[]
  value: string | null
  onChange: (projectId: string) => void
  disabled?: boolean
}

export function ProjectStatsProjectSelect({
  projects,
  value,
  onChange,
  disabled,
}: ProjectStatsProjectSelectProps) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No projects available. Create a project first.</p>
    )
  }

  return (
    <div className="flex max-w-md flex-col gap-1.5">
      <Label htmlFor="stats-project-select">Project</Label>
      <Select
        value={value ?? undefined}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="stats-project-select" className="w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
