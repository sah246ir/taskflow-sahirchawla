import { PageLayout } from '@/layouts/PageLayout'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/shadcn/button'
import { CreateTaskDialog } from './components/CreateTaskDialog'

const ProjectTasksPage = () => {
  const { id: projectId } = useParams<{ id: string }>()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <PageLayout title="Project tasks" description="Tasks for this project.">
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          disabled={!projectId}
          onClick={() => setCreateOpen(true)}
        >
          New task
        </Button>
      </div>
      {projectId ? (
        <CreateTaskDialog
          isOpen={createOpen}
          setOpen={setCreateOpen}
          projectId={projectId}
        />
      ) : null}
    </PageLayout>
  )
}

export default ProjectTasksPage
