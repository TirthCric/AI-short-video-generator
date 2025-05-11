import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const EmptyList = () => {
  return (
    <div className='p-4 py-24 mt-10 flex gap-2 flex-col items-center justify-center border-2 border-dashed rounded-lg'>
        <h2>You don't have any short video created.</h2>
        <Link href='/dashboard/create-new'>
        <Button className='bg-[#8338ec] text-white cursor-pointer hover:bg-[#8833dd]'>Create New Short Video</Button>
        </Link>
    </div>
  )
}

export default EmptyList