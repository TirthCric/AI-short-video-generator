
'use client';

import { PanelsTopLeft, CircleUserIcon, FileVideo, ShieldIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const MenuOptions = [
    {
        id: 1,
        name: 'Dashboard',
        path: '/dashboard',
        icon: PanelsTopLeft
    },
    {
        id: 2,
        name: 'Create New',
        path: '/dashboard/create-new',
        icon: FileVideo
    },
    {
        id: 3,
        name: 'Upgrade',
        path: '/dashboard/upgrades',
        icon: ShieldIcon
    },
]

const Sidebar = () => {

    const path = usePathname();
  return (
    <div className='w-64 h-screen bg-white p-4 shadow-lg'>

        <div className='space-y-4'>
            {MenuOptions.map((option) => (
                <Link key={option.id} href={option.path} className=''>
                <div className={`mb-2 flex gap-3 items-center p-2 hover:bg-[#8338ec] hover:text-white cursor-pointer rounded-xl font-semibold ${path === option.path ? 'bg-[#8338ec] text-white' : ''}`}>
                    <option.icon className='font-semibold w-[1.25rem] h-[1.25rem]' />
                    <span className='text-md'>{option.name}</span>
                </div>
                </Link>
            ))}
        </div>
        
    </div>
  )
}

export default Sidebar