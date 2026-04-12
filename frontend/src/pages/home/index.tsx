import { PageLayout } from '@/layouts/PageLayout'
import { CardWrapper } from '@/components/ui/wrappers/CardWrapper'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getUserStats } from '@/services/auth.service'
import { getProjectStats, listProjects } from '@/services/projects.service'
import { StatsModeToggle, type StatsMode } from './components/StatsModeToggle'
import { ProjectStatsProjectSelect } from './components/ProjectStatsProjectSelect'
import { StatsCountCards } from './components/StatsCountCards'
import { UserStatsProjectBreakdownTable } from './components/UserStatsProjectBreakdownTable'
import { RecentTasksTable } from './components/RecentTasksTable'

const HomePage = () => {
  const [mode, setMode] = useState<StatsMode>('user')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', 'home-picker'],
    queryFn: () => listProjects({ page: 1, limit: 100 }),
  })

  const projects = projectsRes?.data.projects ?? []

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectId(null)
      return
    }
    setSelectedProjectId((prev) => {
      if (prev && projects.some((p) => p.id === prev)) return prev
      return projects[0].id
    })
  }, [projects])

  const { data: userStatsRes, isLoading: userStatsLoading } = useQuery({
    queryKey: ['stats', 'user'],
    queryFn: () => getUserStats(),
    enabled: mode === 'user',
  })

  const { data: projectStatsRes, isLoading: projectStatsLoading } = useQuery({
    queryKey: ['stats', 'project', selectedProjectId],
    queryFn: () => getProjectStats(selectedProjectId!),
    enabled: mode === 'project' && Boolean(selectedProjectId),
  })

  const userStats = userStatsRes?.data
  const projectStats = projectStatsRes?.data

  const counts =
    mode === 'user'
      ? userStats
        ? { todo: userStats.todo, in_progress: userStats.in_progress, done: userStats.done }
        : null
      : projectStats
        ? {
            todo: projectStats.todo,
            in_progress: projectStats.in_progress,
            done: projectStats.done,
          }
        : null

  const recentTasks =
    mode === 'user' ? (userStats?.recent5Tasks ?? []) : (projectStats?.recent5Tasks ?? [])

  const isLoading =
    mode === 'user'
      ? userStatsLoading
      : projectsLoading || !selectedProjectId || projectStatsLoading

  return (
    <PageLayout
      title="Home"
      description="Task counts and your most recently created tasks."
    >
      <div className="flex flex-col gap-6">
        <CardWrapper className="p-4">
          <StatsModeToggle value={mode} onChange={setMode} />
          {mode === 'project' ? (
            <div className="mt-4">
              <ProjectStatsProjectSelect
                projects={projects}
                value={selectedProjectId}
                onChange={setSelectedProjectId}
                disabled={projectsLoading || projects.length === 0}
              />
            </div>
          ) : null}
        </CardWrapper>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading statistics…</p>
        ) : mode === 'project' && projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Create a project to see project-level statistics.
          </p>
        ) : counts ? (
          <StatsCountCards counts={counts} />
        ) : null}

        {mode === 'user' && userStats ? (
          <CardWrapper className="p-4">
            <h2 className="mb-3 text-sm font-medium text-foreground">Breakdown by project</h2>
            <UserStatsProjectBreakdownTable rows={userStats.byProject} />
          </CardWrapper>
        ) : null}

        {!isLoading && !(mode === 'project' && projects.length === 0) ? (
          <CardWrapper className="p-4">
            <RecentTasksTable
              tasks={recentTasks}
              showProjectColumn={mode === 'user'}
            />
          </CardWrapper>
        ) : null}
      </div>
    </PageLayout>
  )
}

export default HomePage
