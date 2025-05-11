import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const Account = () => {
  return (
    <div className='absolute w-full top-0 left-0 pt-20 p-4 '>
        <UserProfile />
    </div>
  )
}

export default Account