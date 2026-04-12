import React from 'react'
import { Loader2 } from 'lucide-react'
import { Typeface } from '@/components/ui/typeface'

const TableLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center animate-fade-in">
      <Loader2 className="size-8 animate-spin text-blue-400 mb-1" />
      <Typeface as="h2" size="md" variant="regular" className='text-blue-400'>
        Loading Data...
      </Typeface>
    </div>
  )
}

export default TableLoader 
