'use client'
import { Button } from '@/components/ui/button'
import { ClerkLoading, UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { Layers2, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const MenuOptions = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    id: 2,
    name: 'Create New',
    path: '/dashboard/create-new',
  },
  {
    id: 3,
    name: 'Upgrade',
    path: '/dashboard/upgrades',
  },
  {
    id: 4,
    name: 'Account',
    path: '/dashboard/account',
  },
]

const Header = () => {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isLoaded])

  if(isLoading) {
    return (
      <div className='fixed top-0 left-0 bottom-0 right-0 bg-white w-full min-h-dvh flex items-center justify-center'>
        <Image src={"/Animation.gif"} width={200} height={200} alt='Loading....' className='' />
      </div>
    )
  }

  return (
    <div className='fixed w-full z-20 bg-white p-4 flex items-center justify-between shadow-md'>
      <Link href={"/"}>
        <div className='flex gap-2 items-center'>
          <Layers2 className='cursor-pointer' />
          <h2 className='font-bold text-xl cursor-pointer text-transparent bg-gradient-to-r from-black to-[#8338ec] bg-clip-text -webkit-background-clip-text'>ShortVidGen</h2>
        </div>
      </Link>

      {/* Desktop Menu*/}
      <div className='hidden md:flex items-center gap-4'>
        <Link href={user ? '/dashboard' : '/sign-in'}>
          <Button className="bg-[#8338ec] cursor-pointer text-white hover:bg-[#8833dd] transition-all duration-200 ease-in-out">
            {user ? "Dashboard" : "Get Started"}
          </Button>
        </Link>
        <UserButton />
      </div>

      {/* Hamburger Menu */}
      <div className='block md:hidden'>
        {
          user ? <Menu onClick={() => setIsOpen(!isOpen)} /> : <Link href={"/sign-in"}><Button className="bg-[#8338ec] cursor-pointer text-white hover:bg-[#8833dd]">Sign In</Button></Link>
        }
      </div>
      <div
        className={`p-4 absolute top-full left-0 w-full bg-white shadow-md transition-all transform origin-top ${
          isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        } duration-200 ease-in-out flex flex-col items-center gap-4 md:hidden`}
      >
        {MenuOptions.map((option) => (
          <Link key={option.id} href={option.path} onClick={() => setIsOpen(false)} className=''>
            <span className='text-xl font-semibold hover:text-[#8338ec]'>{option.name}</span>
          </Link>
        ))}

        <X className='absolute top-4 left-4' onClick={() => setIsOpen(false)} />
      </div>
    </div>
  )
}

export default Header