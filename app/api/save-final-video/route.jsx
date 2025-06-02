// app/api/save-final-video/route.jsx
import { NextResponse } from 'next/server';
import { db } from '@/configs/db'; // Your Drizzle DB instance
import { VideoData } from '@/configs/schema'; // Your VideoData schema
import { currentUser } from '@clerk/nextjs/server'; // For server-side user authentication

export async function POST(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ msg: 'error', error: 'Unauthorized' }, { status: 401 });
        }
        
        const { script, audioFileUrl, captions, imageList, finalVideoUrl } = await request.json();
        
        if (!script || !audioFileUrl || !captions || !imageList) {
            return NextResponse.json({ msg: 'error', error: 'Missing required video data fields' }, { status: 400 });
        }
        
        const [newVideoRecord] = await db.insert(VideoData).values({
            script: script,
            audioFileUrl: audioFileUrl,
            captions: captions,
            imageList: imageList,
            finalVideoUrl: finalVideoUrl, // Ensure this matches your VideoData schema
            createdBy: user.primaryEmailAddress.emailAddress, // Use Clerk's server-side user email
        }).returning({ id: VideoData.id }); // Return the ID of the new record

        if (newVideoRecord) {
            return NextResponse.json({ msg: 'success', videoId: newVideoRecord.id }, { status: 200 });
        } else {
            return NextResponse.json({ msg: 'error', error: 'Failed to save video data' }, { status: 500 });
        }
        
    } catch (error) {
        console.error('Error saving final video data:', error);
        return NextResponse.json({ msg: 'error', error: error.message || 'Internal server error' }, { status: 500 });
    }
}