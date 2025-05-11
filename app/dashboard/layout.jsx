import React from 'react'
import Header from './_components/Header'
import Sidebar from './_components/Sidebar'

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <div className='hidden md:block fixed left-0 top-[70px] h-screen bg-white'>
        <Sidebar />
      </div>
      <div>
        <Header />
        <div className='pt-26 sm:pt-36 ml-0 md:ml-64 p-10'>
          {children}
        </div>
      </div>

    </div>
  )
}

export default DashboardLayout