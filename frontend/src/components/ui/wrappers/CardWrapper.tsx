import React from 'react'
import { cn } from '@/lib/utils'

interface PropTypes{
  children: React.ReactNode,
  className?: string
}

export const CardWrapper = ({ children, className }: PropTypes) => {
  return (
    <div className={cn('p-2 border border-gray-300 rounded-md bg-card', className)}>
      {children}
    </div>
  )
}
