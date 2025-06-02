import { NextResponse } from "next/server";
import { db } from '@/configs/db'; // Your Drizzle DB instance
import { VideoJobs } from '@/configs/schema'; // Your new VideoJobs schema
import Redis from 'ioredis';
import { and, eq, sql, gte } from 'drizzle-orm'; 

const redis = new Redis(process.env.REDIS_URL); // Connect to Upstash Redis

export async function POST(request) {
    try {
        const { formData, userEmail } = await request.json(); // Input from your frontend

        if (!formData || !userEmail) {
            return NextResponse.json({ msg: 'error', error: 'Missing input data or user email' }, { status: 400 });
        }

        // // 1. Check for existing PENDING/PROCESSING job (Idempotency)
        // const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // Check for jobs created in the last 5 minutes

        // const [existingJob] = await db.select()
        //     .from(VideoJobs)
        //     .where(and(
        //         eq(VideoJobs.userId, userEmail),
        //         // *** THE FIX IS HERE ***
        //         // Use the PostgreSQL JSONB '@>' (contains) operator.
        //         // It checks if the JSONB column `VideoJobs.inputData` contains the `formData` object.
        //         // We stringify `formData` and explicitly cast it to `jsonb` using `::jsonb`.
        //         sql`${VideoJobs.inputData} @> ${JSON.stringify(formData)}::jsonb`,
        //         sql`${VideoJobs.status} IN ('PENDING', 'PROCESSING')`, // Use sql for 'IN' operator
        //         gte(VideoJobs.createdAt, fiveMinutesAgo)
        //     ));

        // if (existingJob) {
        //     console.log(`[Vercel API] Existing job ${existingJob.id} found for user ${userEmail}. Returning existing job.`);
        //     return NextResponse.json({ msg: 'success', jobId: existingJob.id, status: existingJob.status }, { status: 200 });
        // }

        // 2. If no existing job, create a new one (as before)
        const [newJob] = await db.insert(VideoJobs).values({
            userId: userEmail,
            status: 'PENDING', // Initial status
            inputData: formData, // Store user's original choices
        }).returning({ id: VideoJobs.id }); // Get the new job's UUID

        if (!newJob || !newJob.id) {
            console.error('Failed to create new job in database.');
            return NextResponse.json({ msg: 'error', error: 'Failed to create job' }, { status: 500 });
        }

        const jobId = newJob.id;

        // 2. Add the job to the Redis queue
        // The background worker will pick this up.
        const jobMessage = { jobId, formData, userEmail };
        await redis.rpush('video_generation_queue', JSON.stringify(jobMessage)); // 'video_generation_queue' is the queue name

        console.log(`[Vercel API] Job ${jobId} added to queue.`);

        // 3. Return immediate success response to the client
        return NextResponse.json({ msg: 'success', jobId: jobId, status: 'QUEUED' }, { status: 200 });

    } catch (error) {
        console.error('[Vercel API] Error starting video generation job:', error);
        return NextResponse.json({ msg: 'error', error: 'Failed to initiate video job', details: error.message }, { status: 500 });
    }
}