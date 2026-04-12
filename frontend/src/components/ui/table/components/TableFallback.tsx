import React from 'react'
import { Typeface } from '@/components/ui/typeface'
import IconCard from '../../card/IconCard'
import { FileText } from 'lucide-react'

type TableFallbackProps = {
  title: string
  description?: string
  cta?: React.ReactNode
}

const TableFallback: React.FC<TableFallbackProps> = ({ title, description, cta }) => {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
        <IconCard className='bg-blue-400 text-white size-14 p-0 mb-2'>
            <FileText className='size-8' />
        </IconCard>
      <Typeface as="h2" size="xl" variant="medium" >
        {title}
      </Typeface>
      {description && (
        <Typeface size="md" color="muted" className="mb-2">
          {description}
        </Typeface>
      )}
      {cta && <div className='cursor-pointer'>{cta}</div>}
    </div>
  )
}

export default TableFallback
