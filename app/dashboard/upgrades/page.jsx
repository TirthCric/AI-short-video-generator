"use client"
import Image from 'next/image'
import React from 'react'

const UpgradePage = () => {
  return (
    <div className='w-full bg-white flex flex-col items-center'>
        {/* <h2 className='text-3xl font-bold'>Work in progress</h2> */}
        <Image 
            src={"/under-contruction.png"}
            alt="under contruction..."
            width={500}
            height={500}
        />
    </div>
  )
}

export default UpgradePage