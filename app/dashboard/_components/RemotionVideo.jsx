'use client'
import React from 'react'
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'

const RemotionVideo = ({ script, imageList, audioFileUrl, captions, totalSeconds, mutate }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame()

    const getDurationFrame = () => {
        return totalSeconds * fps
    }

    const getCurrentCaption = () => {
        const currentTime = frame / fps;
        const currentCaption = captions?.words.find(caption => currentTime >= (caption.start/1000) && currentTime <= (caption.end/1000));
        return currentCaption ? currentCaption.text : " ";
    }

    return (
        <AbsoluteFill className='bg-black'> {/* Changed to a visible background color */}
            {imageList?.map((url, index) => {

                const startTime = (index * getDurationFrame()) / imageList?.length;
                const duration = getDurationFrame();
                const scale = (index) => interpolate(
                    frame,
                    [startTime, startTime + duration / 2, startTime + duration],
                    index % 2 == 0 ? [1, 1.2, 1] : [1.2, 1, 1.2],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                )

                return (
                    <Sequence
                        key={index}
                        from={startTime}
                        durationInFrames={duration}
                    >
                        <AbsoluteFill > 
                            <Img
                                src={url}
                                alt=""
                                className='w-full h-full object-cover'
                                style={{
                                    transform: `scale(${scale(index)})`
                                }}
                            />
                            <AbsoluteFill className=''>
                                <h2 className='absolute font-bold text-white text-2xl bottom-26 text-center w-full'>
                                    {getCurrentCaption()}
                                </h2>
                            </AbsoluteFill>
                        </AbsoluteFill>
                    </Sequence>
                )
            })}

            <Audio
                src={mutate ? " " : audioFileUrl}
            />
        </AbsoluteFill>
    )
}

export default RemotionVideo