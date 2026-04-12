import React from 'react'
import { NavLink } from 'react-router-dom'
import { Typeface } from '../../typeface'
import { cn } from '@/lib/utils'

export type SidebarLinkProps = {
  title: string
  href: string
  icon: React.ReactNode
  onClick?: () => void
  variant?: 'sidebar' | 'bottomBar'
}

export const SidebarLink = ({
  title,
  href,
  icon,
  onClick,
  variant = 'sidebar',
}: SidebarLinkProps) => {
  const isBar = variant === 'bottomBar'
  const layoutClass = isBar
    ? 'flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 min-h-14 min-w-0 rounded-none mb-0 text-center'
    : 'flex items-center p-2 gap-2 rounded-md mb-1'
  const typefaceSize = isBar ? 'xs' : 'sm'
  const typefaceClass = cn('text-inherit', isBar ? 'flex flex-col items-center gap-0.5' : 'flex items-center gap-2')

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(layoutClass, 'w-full hover:bg-blue-50/50')}>
        <Typeface size={typefaceSize} as="p" variant="regular" className={typefaceClass}>
          <span className="shrink-0">{icon}</span>
          {title}
        </Typeface>
      </button>
    )
  }

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(layoutClass, isActive ? 'bg-blue-50 text-blue-800' : 'hover:bg-blue-50/50')
      }
    >
      <Typeface size={typefaceSize} as="p" variant="regular" className={typefaceClass}>
        <span className="shrink-0">{icon}</span>
        {title}
      </Typeface>
    </NavLink>
  )
}
