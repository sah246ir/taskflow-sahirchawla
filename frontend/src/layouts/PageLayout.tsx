import IconCard from '@/components/ui/card/IconCard'
import { Typeface } from '@/components/ui/typeface'
import { CardWrapper } from '@/components/ui/wrappers/CardWrapper'
import { AuthenticationContext } from '@/context/AuthenticationContext'
import { Bell } from 'lucide-react'
import React, { useContext } from 'react'

interface PropTypes {
    children: React.ReactNode,
    title: string,
    description: string
}

export const PageLayout = ({ children, title, description }: PropTypes) => {
    const { user } = useContext(AuthenticationContext)
    return (
        <div className=''>
            <CardWrapper className='flex w-full items-center justify-between mb-4'>
                <div className="">
                    <Typeface color='primary' size='lg' as='h1' variant='medium'>
                        {title}
                    </Typeface>
                    <Typeface color='primary' size='sm' as='p' variant='regular'>
                        {description}
                    </Typeface>
                </div>
                <div className='flex items-center gap-4'>
                    <IconCard>
                        <Bell className='w-4 h-4' />
                    </IconCard>
                    <div className="">
                        <Typeface color='primary' size='sm' as='h1' variant='medium'>
                            {user?.name}
                        </Typeface>
                        <Typeface color='primary' size='xs' as='p' variant='regular'>
                            {user?.email}
                        </Typeface>
                    </div>
                </div>
            </CardWrapper>
            {children}
        </div>
    )
}
