'use client'
import Image from 'next/image'
import React from 'react'

const SelectStyle = ({ onUserSelect }) => {

    const styleOptions = [
        {
            name: 'Realistic',
            image: 'real.jpg'
        },
        {
            name: 'Cartoon',
            image: 'comic.jpg'
        },
        {
            name: 'Comic',
            image: 'cartoon.jpg'
        },
        {
            name: 'watercolor',
            image: 'water_color.jpg'
        },
        {
            name: 'GTA',
            image: 'gta.jpg'
        },
    ]

    const [selectedItem, setSelectedItem] = React.useState(null);

    return (
        <div>
            <h2 className='font-semibold text-xl text-[#8338ec]'>Style</h2>
            <p className='text-gray-500'>Select video Style</p>
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4'>
                {styleOptions.map((option, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer hover:scale-105 transition-all`}
                        onClick={() => {
                            setSelectedItem(option.name)
                            onUserSelect("style", option.name)
                        }}
                    >
                        <Image src={`/${option.image}`} alt={option.name} width={100} height={100} className={`h-40 object-fit object-cover w-full rounded-md ${selectedItem === option.name ? 'border-3 border-[#8338ec]' : ''}`} />
                        <p className='text-lg text-gray-500'>{option.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectStyle