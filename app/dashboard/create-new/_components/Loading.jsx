import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
  } from "@/components/ui/alert-dialog"
  
import Image from 'next/image'
  

const Loading = ({loading}) => {
  return (
    <AlertDialog open={loading} className='p-10 border-none shadow-none'>
  <AlertDialogContent>
    <div className='flex flex-col justify-center items-center'>
        <Image alt='loading....' src={'/progress.gif'} width={100} height={100} />
        <h2>Generating video...Please do not refresh.</h2>
    </div>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default Loading