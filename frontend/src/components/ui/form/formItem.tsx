import { cn } from '@/lib/utils'
import React from 'react'

interface PropTypes{
  className?: string
  children: React.ReactNode
  error?: string
}
export const FormItem = ({ className, children, error }: PropTypes) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {children}
      {error ? <p className="text-red-500 text-sm">{error}</p> : null}
    </div>
  )
}
