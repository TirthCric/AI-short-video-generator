import RemotionVideo from '@/app/dashboard/_components/RemotionVideo'
import { Player } from '@remotion/player'
import React from 'react'

const DemoList = ({data}) => {
    const totalSeconds = 20;
    const mutate = true
    return (
        <div className='w-[200px] h-[300px] rounded-3xl hover:scale-101 justify-self-center sm:justify-items-normal'>
            {data && <Player
                component={RemotionVideo}
                durationInFrames={600} // Use fps here
                compositionWidth={200}
                compositionHeight={300}
                fps={30}
                autoPlay
                loop
                muted={true} 
                inputProps={{
                    ...data,
                    totalSeconds,
                    mutate
                }}
                className='rounded-3xl'
            />
            }
        </div>
    )
}

export default DemoList