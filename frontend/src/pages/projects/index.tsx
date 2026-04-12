import { PageLayout } from '@/layouts/PageLayout'
import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { CreateProjectDialog } from './components/CreateProjectDialog'

const ProjectsPage = () => {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <PageLayout title="Projects" description="Manage your projects.">
      <div className="flex justify-end mb-4">
        <Button type="button" onClick={() => setCreateOpen(true)}>
          New project
        </Button>
      </div>
      <CreateProjectDialog isOpen={createOpen} setOpen={setCreateOpen} />
    </PageLayout>
  )
}

export default ProjectsPage
