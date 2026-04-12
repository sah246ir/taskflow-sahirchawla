import React from 'react'
import { NavLink } from 'react-router-dom'
import { Typeface } from '../../typeface'
import { cn } from '@/lib/utils'

export type SidebarLinkProps = {
  title: string
  href: string
  icon: React.ReactNode
  onClick?: () => void;
}

export const SidebarLink = ({ title, href, icon,onClick }: SidebarLinkProps) => {
  return (
    <>
    {!onclick ? <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'flex items-center p-2 gap-2 rounded-md mb-1',
          isActive ? 'bg-blue-50 text-blue-800' : 'hover:bg-blue-50/50'
        )
      }
    >
      <Typeface size='sm' as='p' variant='regular' className='flex items-center gap-2 text-inherit'>
        <span>{icon}</span>
        {title}
      </Typeface>
    </NavLink>
    :
    <button
      onClick={onClick}
      className={'flex items-center p-2 gap-2 rounded-md mb-1'}
    >
      <Typeface size='sm' as='p' variant='regular' className='flex items-center gap-2 text-inherit'>
        <span>{icon}</span>
        {title}
      </Typeface>
    </button>
    }
    </>
  )
}
