"use client"
import React, { memo, useState } from 'react';
import PlayerDialog from './PlayerDialog';
import Image from 'next/image';
import { Thumbnail } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import { Play } from 'lucide-react';

const VideoList = memo(({ videoListData }) => {
    const [isPlay, setIsPlay] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [totalSeconds, setTotalSeconds] = useState(15);

    const handleOnClick = (videoId) => {
        setIsPlay(true);
        setSelectedVideoId(videoId);
        console.log("This is clicked..... videoId:", videoId);
    };

    const handleCloseDialog = () => {
        setIsPlay(false);
        setSelectedVideoId(null);
    };

    console.log("VideoList component");
    // grid grid-cols-[repeat(3,minmax(0,200px))] md:grid-cols-[repeat(2,minmax(0,200px))] md:justify-center lg:justify-normal lg:grid-cols-[repeat(4,minmax(0,200px))] xl:gap-x-8

    return (
        <div className='h-[auto] flex flex-wrap justify-center lg:justify-normal gap-4 mt-10'>
            {videoListData.map((videoData, index) => (
                // <div key={index}>
                //     <Image
                //         src={videoData?.imageList[0]}
                //         alt="images"
                //         width={300}
                //         height={450}
                //         className='w-[200px] h-[300px] border-2 border-black rounded-2xl cursor-pointer hover:scale-101 transition-all duration-200'
                //         onClick={() => handleOnClick(videoData?.id)} // Pass the videoId
                //     />
                // </div>
                <div

                    key={index}
                    onClick={() => handleOnClick(videoData?.id)}
                    className='relative rounded-2xl cursor-pointer hover:scale-101 transition-all duration-200 w-[200px] h-[300px]'
                >
                    <Thumbnail
                        component={RemotionVideo}
                        compositionWidth={200}
                        compositionHeight={300}
                        frameToDisplay={30}
                        durationInFrames={120}
                        fps={30}
                        inputProps={{
                            ...videoData,
                            totalSeconds
                        }}
                        className='rounded-2xl cursor-pointer hover:scale-101 transition-all duration-200'
                    />
                    <Play className={"absolute left-4 bottom-4 text-white text-base font-bold"} />
                </div>
            ))}

            {isPlay && (
                <PlayerDialog
                    playVideo={isPlay}
                    setIsPlayVideo={handleCloseDialog} // Use a function to close
                    videoId={selectedVideoId}       // Pass the selected videoId
                />
            )}
        </div>
    );
});

export default VideoList;