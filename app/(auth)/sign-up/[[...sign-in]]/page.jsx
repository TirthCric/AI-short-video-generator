"use client"
import { SignUp } from '@clerk/nextjs'
import { Layers2 } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Page() {
  const primaryColor = '#8338ec'; // Your primary website color
  const textColor = '#333'; // A dark text color
  const backgroundColor = '#f7f7f7'; // A light background color

  const appearance = {
    elements: {
      "cl-footer": "none"
    },
    variables: {
      colorPrimary: primaryColor,
      colorText: textColor,
      colorBackground: backgroundColor,
    },
  };
  return (
    <div className='flex justify-center items-center h-screen gap-32'>
      <div className='flex justify-center gap-24'>
        <div className='flex flex-col justify-center items-center '>
          <SignUp appearance={appearance} />
          <p className='font-semibold'>
            Already have an account?<Link href={"/sign-in"}> <span className='text-[#8338ec]'>Sign In</span></Link>
          </p>
        </div>
        <div className='hidden xl:block pt-6 p-4'>
          <h2 className={`md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#8338ec] mb-4 text-center`}>
            Start Your Video Journey
          </h2>
          <p className={`text-xl text-gray-500 text-center max-w-[400px] justify-self-center`}>
            Create your free account and begin generating captivating short videos today.
          </p>
          <Player
            autoplay
            loop
            src="/Animation2.json" // Replace with your JSON file path
            className='w-[500px]'
          />
          <Layers2 className='w-[50px] h-[50px] justify-self-center mt-4 text-gray-300' />
        </div>
      </div>
    </div>
  )

}