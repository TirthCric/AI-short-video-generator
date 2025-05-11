"use client"

import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

const options = ["Custom Prompt", "Random AI Story", "Scary Story", "Historical Fects", "Motivation"]

const SelectTopic = ({ onUserSelect }) => {

    const [selectedOption, setSelectedOption] = useState(null);
    return (
        <div>
            <h2 className='font-semibold text-xl text-[#8338ec]'>Content</h2>
            <p className='text-gray-500'>Select a topic for your content</p>

            <Select onValueChange={(value) => {
                setSelectedOption(value)
                value !== "Custom Prompt" && onUserSelect("topic",value)
            }}>
                <SelectTrigger className="w-full mt-2 p-6 text-lg text-gray-500 focus:ring-[#8338ec] cursor-pointer">
                    <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem key={index} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedOption == "Custom Prompt" && (
                <Textarea 
                onChange={(e) => onUserSelect("topic", e.target.value)}
                className={"mt-4"} 
                placeholder="Write your prompt......" 
                />
            )}



        </div>
    )
}

export default SelectTopic