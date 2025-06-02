import { NextResponse } from "next/server";
import { db } from '@/configs/db';
import { VideoJobs } from '@/configs/schema';
import { eq } from 'drizzle-orm';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json({ msg: 'error', error: 'Job ID is required' }, { status: 400 });
        }

        // Fetch the job status from your Supabase database
        const [job] = await db.select()
            .from(VideoJobs)
            .where(eq(VideoJobs.id, jobId));

        if (!job) {
            return NextResponse.json({ msg: 'error', error: 'Job not found' }, { status: 404 });
        }

        // Return the relevant job status and results
        return NextResponse.json({
            msg: 'success',
            jobId: job.id,
            status: job.status,
            errorMessage: job.errorMessage,
            script: job.script,
            audioFileUrl: job.audioFileUrl,
            captions: job.captions,
            imageList: job.imageList
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching job status:', error);
        return NextResponse.json({ msg: 'error', error: 'Failed to fetch job status', details: error.message }, { status: 500 });
    }
}