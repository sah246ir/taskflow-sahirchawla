import React from 'react'
import logo from '@/assets/logo.png'
import { CardWrapper } from '../wrappers/CardWrapper'
import { Typeface } from '../typeface'
import { SIDEBAR_ITEMS } from './constants'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const Sidebar = () => {
  return (
    <div className='flex flex-col gap-4 h-[calc(100vh-35px)] min-w-48'>
      <CardWrapper className='p-4'>
        <img src={logo} alt="logo" width={115} className='mx-auto' />
      </CardWrapper>

      <CardWrapper className='p-0 py-2 h-full flex-1 flex flex-col gap-8'>
        {SIDEBAR_ITEMS.map((item) => (
          <div key={item.title}>
            <Typeface className='px-2 pb-1 border-b border-gray-200 mb-1' color='secondary' size='sm' as='h1' variant='regular'>
              {item.title}
            </Typeface>
            <div className="p-3">
              {item.items.map((item) => (
                <NavLink 
                key={item.title} 
                to={item.href} 
                className={({ isActive }) => cn(
                  'flex items-center p-2 gap-2 rounded-md mb-1', 
                  isActive ? 'bg-blue-50 text-blue-800' : 'hover:bg-blue-50/50'
                )}>
                  <Typeface  size='sm' as='p' variant='regular' className='flex items-center gap-2 text-inherit'>
                    <span>{item.icon}</span>
                    {item.title}
                  </Typeface>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </CardWrapper>
    </div>
  )
}
