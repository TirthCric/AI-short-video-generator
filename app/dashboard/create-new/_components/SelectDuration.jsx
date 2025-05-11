'use client'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SelectDuration = ({ onUserSelect }) => {

    const options = ['20 seconds', '30 seconds', '45 seconds', '60 seconds']
    return (
        <div>
            <h2 className='font-semibold text-xl text-[#8338ec]'>Duration</h2>
            <p className='text-gray-500'>Select a duration for your content</p>
            <div>
                <Select onValueChange={(value) => {
                    onUserSelect("duration", value)
                }}>
                    <SelectTrigger className="w-[240px] mt-2 p-6 text-lg text-gray-500 focus:ring-[#8338ec] cursor-pointer">
                        <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option, index) => (
                            <SelectItem key={index} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default SelectDuration