
'use client'

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Player } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import { Button } from '@/components/ui/button';
import { VideoData } from '@/configs/schema';
import { db } from '@/configs/db';
import { eq } from 'drizzle-orm';
import { usePathname, useRouter } from 'next/navigation';
import { DialogClose } from '@radix-ui/react-dialog';
import { toast } from 'sonner';

// Tesing Purpose

// const testingData = {
//     id: 3,
//     script: 'They say the old house on Hemlock Lane is cursed… …g reached out of the shadows… And then… darkness.',
//     audioFileUrl: 'https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/audio/audio/b10e1f0a-a229-422b-8395-608152315dd1.mp3',
//     imageList: [
//         "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/1746684595147.jpeg",
//         "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/1746684630872.jpeg",
//         "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/1746684666249.jpeg",
//         "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/1746684702952.jpeg",
//         "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/1746684739017.jpeg"
//     ],
//     captions: {
//         words: [
//             { text: 'They', start: 0.119, end: 0.239, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 0.239, end: 0.299, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'say', start: 0.299, end: 0.46, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 0.46, end: 0.519, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'the', start: 0.519, end: 0.62, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 0.62, end: 0.639, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'old', start: 0.639, end: 0.839, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 0.839, end: 0.879, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'house', start: 0.879, end: 1.159, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 1.159, end: 1.179, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'on', start: 1.179, end: 1.259, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 1.259, end: 1.319, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'Hemlock', start: 1.319, end: 1.679, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 1.679, end: 1.719, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'Lane', start: 1.719, end: 1.959, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 1.959, end: 1.959, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'is', start: 1.959, end: 2.159, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 2.159, end: 2.159, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'cursed,', start: 2.159, end: 2.739, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 2.739, end: 3.079, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'and', start: 3.079, end: 3.179, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 3.179, end: 3.279, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'I', start: 3.279, end: 3.299, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 3.299, end: 3.299, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'was', start: 3.299, end: 3.439, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 3.439, end: 3.5, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'foolish', start: 3.5, end: 3.819, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 3.819, end: 3.819, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'enough', start: 3.819, end: 4.079, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 4.079, end: 4.079, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'to', start: 4.079, end: 4.199, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 4.199, end: 4.219, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'go', start: 4.219, end: 4.339, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 4.339, end: 4.36, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'inside.', start: 4.36, end: 4.899, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 4.899, end: 5.619, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'I', start: 5.619, end: 5.759, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 5.759, end: 5.759, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'heard', start: 5.759, end: 5.939, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 5.939, end: 5.96, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'a', start: 5.96, end: 6.019, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 6.019, end: 6.019, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'noise,', start: 6.019, end: 6.56, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 6.56, end: 7.099, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'a', start: 7.099, end: 7.139, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 7.139, end: 7.199, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'whisper,', start: 7.199, end: 7.719, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 7.719, end: 8.359, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'and', start: 8.359, end: 8.52, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 8.52, end: 8.52, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'then', start: 8.52, end: 8.819, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 8.819, end: 8.859, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'a', start: 8.859, end: 8.939, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 8.939, end: 8.96, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'presence.', start: 8.96, end: 9.52, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 9.52, end: 9.96, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'Something', start: 9.96, end: 10.36, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 10.36, end: 10.36, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'reached', start: 10.36, end: 10.679, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 10.679, end: 10.679, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'out', start: 10.679, end: 10.88, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 10.88, end: 10.899, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'of', start: 10.899, end: 10.98, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 10.98, end: 11, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'the', start: 11, end: 11.06, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 11.06, end: 11.119, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'shadows,', start: 11.119, end: 11.719, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 11.719, end: 12.319, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'and', start: 12.319, end: 12.479, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 12.479, end: 12.479, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'then', start: 12.479, end: 12.739, type: 'word', speaker_id: 'speaker_0' },
//             { text: ' ', start: 12.739, end: 13.599, type: 'spacing', speaker_id: 'speaker_0' },
//             { text: 'darkness.', start: 13.599, end: 14.319, type: 'word', speaker_id: 'speaker_0' }
//         ],
//         length: 73
//     }
// }
// const totalSeconds = 15


const PlayerDialog = ({ playVideo, videoId, setIsPlayVideo }) => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [data, setData] = useState(null);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [loading, setLoading] = useState(false); // Add a loading state

    const currentPath = usePathname();
    // const id = 2
    // console.log("This is log in playerDiaglog", playVideo, videoId)
    const router = useRouter();

    useEffect(() => {
        setIsOpenDialog(playVideo);
        if (playVideo && videoId) {
            const videoDataCache = JSON.parse(sessionStorage.getItem(`videoDataCache_${videoId}`));
            setLoading(true);
            if (videoDataCache) {
                setData(videoDataCache);
                const lastCaptionEnd = videoDataCache?.captions?.words[videoDataCache?.captions?.words?.length - 1]?.end;
                setTotalSeconds(lastCaptionEnd ? Math.ceil((lastCaptionEnd / 1000)) : 0);
                // console.log("**Player Dialog** Data fetched from session");
                setLoading(false);
            } else {
                getVideoData(videoId);
                // console.log("**Player Dialog** Data fetched from Database");
            }
        } else {
            setData(null);
            setTotalSeconds(0);
            setLoading(false);
            setIsPlayVideo(false);
        }
    }, [playVideo, videoId]);

    const getVideoData = async (id) => {
        try {
            const result = await db.select().from(VideoData).where(eq(VideoData?.id, id));
            setData(result[0]);
            sessionStorage.setItem(`videoDataCache_${id}`, JSON.stringify(result[0]));
            // console.log('this is result', result[0])
            const lastCaptionEnd = result[0]?.captions?.words[result[0]?.captions?.words?.length - 1]?.end;
            // console.log("Last caption ended :", lastCaptionEnd);

            setTotalSeconds(lastCaptionEnd ? Math.ceil((lastCaptionEnd/1000)) : 0);
        } catch (error) {
            console.error("Error fetching video data:", error);
            // Handle error appropriately, e.g., set an error state
            setData(null);
            setTotalSeconds(0);
        } finally {
            setLoading(false);
        }
    };

    // console.log("This is the data:", data);
    // console.log("This is total seconds:", totalSeconds);

    if (loading) {
        return (
            <Dialog open={isOpenDialog}>
                <DialogContent className={"bg-white"}>
                    <DialogHeader>
                        <DialogTitle className={"text-3xl font-bold my-5"}>Loading video...</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpenDialog}>
            <DialogContent className={"bg-white flex justify-center"}>
                <DialogHeader>
                    <DialogTitle className={"text-3xl font-bold my-5 text-center"}>Your video is ready</DialogTitle>
                    {data && (
                        <Player
                            component={RemotionVideo}
                            durationInFrames={Number(totalSeconds.toFixed(0)) * 30} // Use fps here
                            compositionWidth={300}
                            compositionHeight={450}
                            fps={30}
                            controls={true}
                            inputProps={{
                                ...data,
                                totalSeconds
                            }}
                        />
                    )}
                    <div className='flex justify-center space-x-10 mt-4'>
                        <Button
                            variant={"ghost"}
                            className={"border-2 border-[#8338ec]"}
                            onClick={() => {
                                setIsPlayVideo(false);
                                setIsOpenDialog(false);
                                currentPath == '/dashboard/create-new' && router.replace('/dashboard');
                            }}
                        >Cancel</Button>
                        <Button
                            className="bg-[#8338ec] hover:bg-[#8833dd]"
                            onClick={() => {
                                toast("Sorry! But we don't impliment export yet.");
                                setIsPlayVideo(false);
                                setIsOpenDialog(false);
                                currentPath == '/dashboard/create-new' && router.replace('/dashboard');
                            }}
                        >Export</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default PlayerDialog