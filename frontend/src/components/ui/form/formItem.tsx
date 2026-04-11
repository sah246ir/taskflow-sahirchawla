import { cn } from '@/lib/utils'
import React from 'react'

interface PropTypes{
  className?: string
  children: React.ReactNode
}
export const FormItem = ({ className, children }: PropTypes) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {children}
    </div>
  )
}
