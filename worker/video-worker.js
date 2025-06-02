// worker/video-worker.js
// This script is designed to run as a separate Node.js process,
// e.g., on a Render Background Worker, DigitalOcean Droplet, etc.
import 'dotenv/config';

import Redis from 'ioredis';
import { VideoJobs } from '../configs/schema.js'; // Adjust path
import ImagePig from 'imagepig';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // Renamed to uuidv4 to avoid conflict with 'uuid' module name
import { db } from '../configs/db.js';
// import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { AssemblyAI } from "assemblyai";
import axios from 'axios';

// const DemoScript = [
//     {
//         "scene": 1,
//         "duration": 4,
//         "imagePrompt": "Comic book panel, close-up on a young woman's terrified face, large, expressive eyes wide with fear. Rain streaks down a window behind her, blurring the background.",
//         "contentText": "(Sound of rain) Sarah was home alone. The storm raged outside."
//     },
//     {
//         "scene": 2,
//         "duration": 4,
//         "imagePrompt": "Comic panel, medium shot. Sarah is holding a phone, the screen displaying 'No Signal'. She's in a dimly lit living room, shadows cast by a flickering lamp. Exaggerated comic book style.",
//         "contentText": "The power flickered. Her phone died. She was cut off."
//     },
//     {
//         "scene": 3,
//         "duration": 4,
//         "imagePrompt": "Comic panel, extreme close-up on a doorknob slowly turning. Exaggerated shadows make the scene more ominous. Classic comic book halftone shading.",
//         "contentText": "Then, she heard it. A click. The front door..."
//     },
//     {
//         "scene": 4,
//         "duration": 4,
//         "imagePrompt": "Comic panel, POV shot from Sarah's perspective. A tall, silhouetted figure stands in the doorway, their face obscured by shadow. Sharp, angular lines emphasize the figure's menacing presence. Speech bubble: 'Who's there?'",
//         "contentText": "She whispered, 'Who's there?' Only silence answered."
//     },
//     {
//         "scene": 5,
//         "duration": 4,
//         "imagePrompt": "Comic panel, action shot. The shadowy figure lunges forward, a jagged speech bubble exclaiming 'GOTCHA!' Dark, heavy inks create a sense of immediate danger. Sound Effect: 'THUMP!'",
//         "contentText": "(Sound effect: THUMP!)"
//     }
// ]

// const DemoAudio = {
//     publicUrl: "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/audio/audio/a326b079-a9c9-4f19-806b-59e6b756a695.mp3",
//     transcription: {
//         words: [
//             {
//                 text: 'Sound',
//                 start: 480,
//                 end: 880,
//                 confidence: 0.87501395,
//                 speaker: null
//             },
//             {
//                 text: 'of',
//                 start: 960,
//                 end: 1040,
//                 confidence: 0.9937093,
//                 speaker: null
//             },
//             {
//                 text: 'rain.',
//                 start: 1120,
//                 end: 1440,
//                 confidence: 0.6537516,
//                 speaker: null
//             },
//             {
//                 text: 'Sarah',
//                 start: 2000,
//                 end: 2480,
//                 confidence: 0.90521115,
//                 speaker: null
//             },
//             {
//                 text: 'was',
//                 start: 2560,
//                 end: 2640,
//                 confidence: 0.9925355,
//                 speaker: null
//             },
//             {
//                 text: 'home',
//                 start: 2800,
//                 end: 2880,
//                 confidence: 0.99377644,
//                 speaker: null
//             },
//             {
//                 text: 'alone.',
//                 start: 3040,
//                 end: 3360,
//                 confidence: 0.95122313,
//                 speaker: null
//             },
//             {
//                 text: 'The',
//                 start: 3840,
//                 end: 3920,
//                 confidence: 0.99029225,
//                 speaker: null
//             },
//             {
//                 text: 'storm',
//                 start: 4080,
//                 end: 4480,
//                 confidence: 0.99145037,
//                 speaker: null
//             },
//             {
//                 text: 'raged',
//                 start: 4640,
//                 end: 4960,
//                 confidence: 0.99767447,
//                 speaker: null
//             },
//             {
//                 text: 'outside.',
//                 start: 5120,
//                 end: 5360,
//                 confidence: 0.9356972,
//                 speaker: null
//             },
//             {
//                 text: 'The',
//                 start: 6000,
//                 end: 6080,
//                 confidence: 0.99247473,
//                 speaker: null
//             },
//             {
//                 text: 'power',
//                 start: 6240,
//                 end: 6320,
//                 confidence: 0.9896526,
//                 speaker: null
//             },
//             {
//                 text: 'flickered.',
//                 start: 6720,
//                 end: 7200,
//                 confidence: 0.9500836,
//                 speaker: null
//             },
//             {
//                 text: 'Her',
//                 start: 7600,
//                 end: 7840,
//                 confidence: 0.99532324,
//                 speaker: null
//             },
//             {
//                 text: 'phone',
//                 start: 7920,
//                 end: 8240,
//                 confidence: 0.9898925,
//                 speaker: null
//             },
//             {
//                 text: 'died.',
//                 start: 8400,
//                 end: 8720,
//                 confidence: 0.98578125,
//                 speaker: null
//             },
//             {
//                 text: 'She',
//                 start: 9200,
//                 end: 9280,
//                 confidence: 0.9968983,
//                 speaker: null
//             },
//             {
//                 text: 'was',
//                 start: 9440,
//                 end: 9520,
//                 confidence: 0.9965487,
//                 speaker: null
//             },
//             {
//                 text: 'cut',
//                 start: 9680,
//                 end: 9920,
//                 confidence: 0.9961229,
//                 speaker: null
//             },
//             {
//                 text: 'off.',
//                 start: 10000,
//                 end: 10080,
//                 confidence: 0.97587836,
//                 speaker: null
//             },
//             {
//                 text: 'Then',
//                 start: 10640,
//                 end: 10960,
//                 confidence: 0.9936155,
//                 speaker: null
//             },
//             {
//                 text: 'she',
//                 start: 11040,
//                 end: 11120,
//                 confidence: 0.89737004,
//                 speaker: null
//             },
//             {
//                 text: 'heard',
//                 start: 11360,
//                 end: 11520,
//                 confidence: 0.9923414,
//                 speaker: null
//             },
//             {
//                 text: 'it.',
//                 start: 11600,
//                 end: 11680,
//                 confidence: 0.81175494,
//                 speaker: null
//             },
//             {
//                 text: 'A',
//                 start: 12240,
//                 end: 12320,
//                 confidence: 0.9906447,
//                 speaker: null
//             },
//             {
//                 text: 'click.',
//                 start: 12560,
//                 end: 12880,
//                 confidence: 0.94159824,
//                 speaker: null
//             },
//             {
//                 text: 'The',
//                 start: 13360,
//                 end: 13440,
//                 confidence: 0.99289155,
//                 speaker: null
//             },
//             {
//                 text: 'front',
//                 start: 13600,
//                 end: 13680,
//                 confidence: 0.99437886,
//                 speaker: null
//             },
//             {
//                 text: 'door.',
//                 start: 14000,
//                 end: 14240,
//                 confidence: 0.94162637,
//                 speaker: null
//             },
//             {
//                 text: 'She',
//                 start: 14720,
//                 end: 14800,
//                 confidence: 0.98866177,
//                 speaker: null
//             },
//             {
//                 text: 'whispered,',
//                 start: 14960,
//                 end: 15440,
//                 confidence: 0.53873885,
//                 speaker: null
//             },
//             {
//                 text: "who's",
//                 start: 15600,
//                 end: 15920,
//                 confidence: 0.97970015,
//                 speaker: null
//             },
//             {
//                 text: 'there?',
//                 start: 16000,
//                 end: 16080,
//                 confidence: 0.9505235,
//                 speaker: null
//             },
//             {
//                 text: 'Only',
//                 start: 16640,
//                 end: 17040,
//                 confidence: 0.9610572,
//                 speaker: null
//             },
//             {
//                 text: 'silence',
//                 start: 17120,
//                 end: 17600,
//                 confidence: 0.9848125,
//                 speaker: null
//             },
//             {
//                 text: 'answered.',
//                 start: 17760,
//                 end: 18160,
//                 confidence: 0.9932402,
//                 speaker: null
//             },
//             {
//                 text: 'Sound',
//                 start: 18640,
//                 end: 18960,
//                 confidence: 0.97790194,
//                 speaker: null
//             },
//             {
//                 text: 'effect:',
//                 start: 19120,
//                 end: 19200,
//                 confidence: 0.39279306,
//                 speaker: null
//             },
//             {
//                 text: 'thump.',
//                 start: 19600,
//                 end: 20000,
//                 confidence: 0.5500323,
//                 speaker: null
//             }
//         ],
//     }
// }

// const DemoImageUrls = [
//     "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/92ee7f9d-752d-4c6b-ad2e-b44b2a27628b.jpeg",
//     " https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/2001fad1-14d1-47af-a0e3-4f78a0dc9941.jpeg",
//     "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/4acb2319-e4f3-4003-8613-06a569822bfb.jpeg",
//     "https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/f50bce68-6078-49c3-9798-759e2f8600fa.jpeg",
//     " https://auptyxevnjmcppzuinjk.supabase.co/storage/v1/object/public/images/images/1ad1483a-32fc-4325-be4c-a2ed614745ce.jpeg",
// ]

// --- Initialize Clients ---
const redis = new Redis(process.env.REDIS_URL);
const imagepig = new ImagePig(process.env.IMAGEPIG_API_KEY);
const UNREAL_SPEECH_API_KEY = process.env.UNREAL_SPEECH_API_KEY

// const elevenLabsClient = new ElevenLabsClient({
//     apiKey: process.env.ELEVENLABS_API_KEY,
// });

// Assembly AI client 
const AssemblyAIClient = new AssemblyAI({
    apiKey: process.env.ASSEMBLY_AI_API_KEY,
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// --- Helper Functions (adapted from  API routes) ---

// This function generates the video script using the Gemini API.
const generateScriptWorker = async (prompt) => {
    try {
        // ***************************************************************************************************************************
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        const config = {
            responseMimeType: 'application/json',
        };
        const model = 'gemini-2.0-flash';


        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: `Write a script to generate 30 second video on topic: Scary story align with AI Image prompt in realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field.`,
                    },
                ],
            },
            {
                role: 'model',
                parts: [
                    {
                        text: `\`\`\`json
                [
                    {
                    "scene": 1,
                    "duration": 5,
                    "imagePrompt": "A dimly lit, antique Victorian bedroom. Moonlight streams through a large window, illuminating dust motes dancing in the air. A four-poster bed dominates the room, covered in a velvet comforter. An old, ornate mirror hangs on the wall, reflecting a distorted view of the room.",
                    "contentText": "The old house stood silent on the hill, a sentinel watching over the town. They said it was haunted. I, a skeptic, took the dare, spending the night alone."
                    },
                    {
                    "scene": 2,
                    "duration": 5,
                    "imagePrompt": "Close-up on the ornate mirror from scene 1. The reflection flickers and distorts, revealing a shadowy figure in the background. The figure's face is obscured.",
                    "contentText": "As the hours ticked by, the silence began to press in. Then, I noticed it: a subtle movement in the mirror's reflection. Something…or someone…was there."
                    },
                    {
                    "scene": 3,
                    "duration": 5,
                    "imagePrompt": "A close-up shot of a worn, leather-bound journal lying on a dusty table. The pages are filled with frantic, looping handwriting. A single, dried rose rests beside it.",
                    "contentText": "I found a journal hidden in a drawer. Its pages chronicled the house's history, tales of a woman, consumed by madness, and… a terrible promise."
                    },
                    {
                    "scene": 4,
                    "duration": 5,
                    "imagePrompt": "A medium shot of the bedroom. The moonlight is now partially obscured by dark, swirling clouds. The shadowy figure in the mirror is now more defined, taking a step closer to the camera. Its eyes are glowing with an eerie light.",
                    "contentText": "The air grew cold. The shadows deepened. The figure in the mirror moved, its gaze locked on mine. It reached out, a skeletal hand reaching towards the mirror."
                    },
                    {
                    "scene": 5,
                    "duration": 5,
                    "imagePrompt": "A wide shot of the bedroom. The reflection in the mirror has now shattered. The shadowy figure is no longer in the mirror, but standing in the room behind the camera and reaching out towards the camera, its eyes are glowing.",
                    "contentText": "Suddenly, the mirror shattered. And then…I realized it wasn't a reflection anymore. It was real. It was here. And it was coming for me."
                    },
                    {
                    "scene": 6,
                    "duration": 5,
                    "imagePrompt": "Dark screen with a single, red glowing eye staring into the camera. A loud, chilling scream can be heard.",
                    "contentText": "(Sound of a chilling scream)"
                    }
                ]
                \`\`\`
                `,
                    },
                ],
            },
            {
                role: 'user',
                parts: [
                    {
                        text: `${prompt}`,
                    },
                ],
            },
        ];

        const stream = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });

        let generatedText = '';
        for await (const chunk of stream) {
            generatedText += chunk.text;
        }

        // This is the most robust way to extract JSON from LLM output:
        const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/);
        let jsonToParse;

        if (jsonMatch && jsonMatch[1]) {
            jsonToParse = jsonMatch[1].trim(); // Extract content and trim any whitespace
            console.log('--- Extracted JSON String from Markdown ---');
            console.log(jsonToParse);
            console.log('--- End Extracted JSON String ---');
        } else {
            // Fallback: If no markdown block, assume it's direct JSON but trim it heavily
            jsonToParse = generatedText.trim();
            console.log('--- No Markdown detected, attempting to parse trimmed text as direct JSON ---');
            console.log(jsonToParse);
            console.log('--- End Trimmed Text ---');
            // You might want to throw an error here if the model *should* always use markdown.
        }

        const parsedResponse = JSON.parse(jsonToParse);

        // Optional: Add basic validation of the parsed structure
        if (!Array.isArray(parsedResponse) || parsedResponse.length === 0) {
            throw new Error("Gemini response is not a valid array of scenes.");
        }
        parsedResponse.forEach(scene => {
            if (typeof scene !== 'object' || !('scene' in scene) || !('duration' in scene) || !('imagePrompt' in scene) || !('contentText' in scene)) {
                throw new Error("Gemini response scene object is missing required fields.");
            }
        });


        // Return the parsed array directly
        return parsedResponse;
    } catch (error) {
        console.error('Worker: Error generating video script from Gemini:', error);
        throw new Error(`Failed to generate video script: ${error}`);
    }
};

// This function generates audio and captions using ElevenLabs API and uploads to Supabase.
const generateAudioWorker = async (scriptText) => {
    try {
        // Generate audio using ElevenLabs API
        // const audioStream = await elevenLabsClient.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', { // Replace with your actual voice_id
        //     model_id: 'eleven_multilingual_v2',
        //     text: scriptText,
        //     output_format: 'mp3_44100_128',
        //     voice_settings: {
        //         stability: 0,
        //         similarity_boost: 0,
        //         use_speaker_boost: true,
        //         speed: 1.0,
        //     },
        // });

        const audioResponse = await axios.post('https://api.v8.unrealspeech.com/stream', {
            Text: scriptText,
            VoiceId: "am_adam",
            Bitrate: "192k",

            // Add other optional parameters like 'model', 'bitrate', 'speed', etc.
        }, {
            headers: {
                'Authorization': `Bearer ${UNREAL_SPEECH_API_KEY}`,
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer'
        });

        // throw new Error("****************** wait for testing *************************")


        // Convert the readable stream to a buffer
        // const chunks = [];
        // const reader = audioStream.getReader();
        // while (true) {
        //     const { done, value } = await reader.read();
        //     if (done) break;
        //     chunks.push(value);
        // }
        // const audioBuffer = Buffer.concat(chunks);

        const audioBuffer = audioResponse?.data; // Unreal speech api returns audio buffer directly
        const filePath = `audio/${uuidv4()}.mp3`; // Generate a unique filename

        // Upload the audio file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('audio')
            .upload(filePath, audioBuffer, {
                contentType: 'audio/mpeg',
            });

        if (uploadError) {
            throw new Error(`Supabase audio upload error: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
            .from('audio')
            .getPublicUrl(uploadData.path);
        const publicUrl = publicUrlData.publicUrl;

        // --- Generate Caption file from ElevenLabs API (Speech-to-Text) ---
        // Your original code fetches from the public URL, but the audioBuffer is already available.
        // It's more efficient to pass the Buffer or Blob directly to `speechToText.convert`
        // However, ElevenLabs SDK `speechToText.convert` expects a `File` or `Blob` for the `file` param
        // This is a common challenge with Node.js Buffers. We can create a Blob from Buffer.
        // const audioBlobForTranscription = new Blob([audioBuffer], { type: "audio/mp3" });

        // const transcription = await elevenLabsClient.speechToText.convert({
        //     file: audioBlobForTranscription,
        //     model_id: "scribe_v1",
        //     tag_audio_events: true,
        //     language_code: "eng",
        //     diarize: true,
        // });

        const transcription = await AssemblyAIClient.transcripts.transcribe({
            audio: publicUrl,
            speech_model: 'slam-1'
        });

        console.log("This is response of transciption generated:", transcription)
        // The transcription object from ElevenLabs client usually contains a 'words' array or similar.
        // Your original schema expects JSON for captions. Adjust `transcription` format as needed.
        // Assuming `transcription` itself is the desired JSON or has a `words` property.
        // const captionsJson = transcription.words ? transcription.words : { fullText: transcription.text };

        return { publicUrl, transcription: transcription };
    } catch (error) {
        console.error('Worker: Error in audio generation and upload:', error);
        throw new Error(`Failed to generate audio or captions: ${error}`);
    }

};

// This function generates images using ImagePig API and uploads to Supabase.
const generateImageWorker = async (imagePrompts) => {
    const imageUrls = [];
    const delayMs = 30 * 1000; // 30 seconds delay between ImagePig requests

    for (const [index, imagePrompt] of imagePrompts.entries()) {
        try {
            if (index > 0) {
                console.log(`Worker: Waiting ${delayMs / 1000} seconds before generating image ${index + 1}.`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }

            console.log(`Worker: Generating image for prompt: "${imagePrompt}" (Image ${index + 1}/${imagePrompts.length})`);
            const imagepigResponse = await imagepig.xl(imagePrompt);
            const base64Image = imagepigResponse.content.image_data;
            const mimeType = imagepigResponse.mimeType; // e.g., 'image/jpeg'

            const imageName = `${uuidv4()}.jpeg`; // Unique filename
            const imagePath = `images/${imageName}`;
            const buffer = Buffer.from(base64Image, 'base64');

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images')
                .upload(imagePath, buffer, { contentType: mimeType });

            if (uploadError) {
                throw new Error(`Supabase image upload error: ${uploadError.message}`);
            }

            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(uploadData.path);
            const publicUrl = publicUrlData.publicUrl;

            imageUrls.push(publicUrl);
            console.log(`Worker: Image ${index + 1} generated and uploaded: ${publicUrl}`);

        } catch (apiError) {
            console.error(`Worker: Error generating image ${index + 1}:`, apiError);
            throw new Error(`Failed to generate image ${index + 1}: ${apiError.message}`);
        }
    }
    return imageUrls;

};

// Helper function to distribute script and image prompts (from your CreateNew component)
const distributeScriptAndImagePrompts = (data) => {
    // Assuming data is an array of objects like { imagePrompt: "...", contentText: "..." }
    const script = data.map(item => item.contentText).join(' ');
    const imagePrompts = data.map(item => item.imagePrompt);
    return { script, imagePrompts };
};

// --- Main Job Processing Logic ---
const processJob = async (jobId, jobData) => {
    // Fetch current job status from DB
    const [currentJobStatus] = await db.select({ status: VideoJobs.status })
        .from(VideoJobs)
        .where(eq(VideoJobs.id, jobId));

    if (currentJobStatus && (currentJobStatus.status === 'COMPLETED' || currentJobStatus.status === 'FAILED')) {
        console.warn(`Worker: Job ${jobId} already ${currentJobStatus.status}. Skipping processing.`);
        return; // Exit if already done
    }

    console.log(`Worker: Starting to process job ${jobId}`);
    let jobStatus = 'FAILED'; // Default to FAILED, will update on success
    let errorMessage = null;
    let finalVideoUrl = null; // Placeholder for your Remotion video URL
    let imageList = [];

    try {
        // 1. Update job status to PROCESSING
        await db.update(VideoJobs)
            .set({ status: 'PROCESSING', updatedAt: new Date() })
            .where(eq(VideoJobs.id, jobId));

        const { formData } = jobData; // formData contains topic, style, duration

        // 2. Generate Script (from Gemini)
        const scriptPrompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} align with AI Image prompt in ${formData.style} format for each scene and give me result in JSON format with imagePrompt and ContentText as field.`;
        const geminiResponse = await generateScriptWorker(scriptPrompt); // This now returns parsed JSON
        const { script: generatedScriptText, imagePrompts } = distributeScriptAndImagePrompts(geminiResponse);

        if (!generatedScriptText || !imagePrompts || imagePrompts.length === 0) {
            throw new Error("Script or image prompts generation failed or returned empty.");
        }

        // Update DB with generated script and image prompts (for debugging/re-use)
        await db.update(VideoJobs)
            .set({
                script: generatedScriptText, // Store script as JSON/text
                inputData: { ...formData, imagePrompts: imagePrompts }, // Store image prompts within inputData for worker context
                updatedAt: new Date()
            })
            .where(eq(VideoJobs.id, jobId));

        // 3. Generate Audio and Captions (from ElevenLabs)
        const audioResult = await generateAudioWorker(generatedScriptText);
        const generatedAudioUrl = audioResult.publicUrl;
        const generatedCaptions = audioResult.transcription; // This should be JSON from ElevenLabs

        // Update DB with audio data
        await db.update(VideoJobs)
            .set({
                audioFileUrl: generatedAudioUrl,
                captions: generatedCaptions,
                updatedAt: new Date()
            })
            .where(eq(VideoJobs.id, jobId));

        // 4. Generate Images (from ImagePig)
        const generatedImageUrls = await generateImageWorker(imagePrompts);

        // Update DB with image URLs
        await db.update(VideoJobs)
            .set({
                imageList: generatedImageUrls,
                updatedAt: new Date()
            })
            .where(eq(VideoJobs.id, jobId));

        // 5. REMOTION VIDEO ASSEMBLY (YOUR NEXT STEP)
        // This is where you would trigger your Remotion rendering process.
        // This might involve:
        //    a) Calling another API endpoint on a separate Remotion server (if self-hosted)
        //    b) Using a Remotion cloud rendering service SDK (e.g., Remotion Lambda, Remotion Cloud)
        //    c) Running a local FFmpeg command if your worker environment supports it (more complex).
        // For now, it's a placeholder. You'd pass `generatedImageUrls`, `generatedAudioUrl`, `generatedCaptions`, and `generatedScriptText` to it.
        // Example:
        // const remotionRenderResponse = await fetch('YOUR_REMOTION_RENDER_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         images: generatedImageUrls,
        //         audio: generatedAudioUrl,
        //         captions: generatedCaptions,
        //         script: generatedScriptText
        //     })
        // });
        // if (!remotionRenderResponse.ok) {
        //     throw new Error("Remotion render failed.");
        // }
        // const remotionResult = await remotionRenderResponse.json();
        // finalVideoUrl = remotionResult.videoUrl; // Assuming it returns the final video URL

        finalVideoUrl = "https://example.com/your-remotion-video-output.mp4"; // Placeholder for actual Remotion video URL

        jobStatus = 'COMPLETED'; // All processing steps successful

    } catch (error) {
        console.error(`Worker: Error processing job ${jobId}:`, error);
        errorMessage = error.message || 'Unknown error during video generation.';
        jobStatus = 'FAILED';
    } finally {
        // 6. Update final job status in the database
        await db.update(VideoJobs)
            .set({
                status: jobStatus,
                errorMessage: errorMessage,
                finalVideoUrl: finalVideoUrl, // Store final video URL if available
                updatedAt: new Date()
            })
            .where(eq(VideoJobs.id, jobId));

        console.log(`Worker: Job ${jobId} finished with status: ${jobStatus}`);
    }
};

// --- Start Listening for Jobs ---
async function startWorker() {
    console.log("Video generation worker started, listening for jobs on 'video_generation_queue'...");
    while (true) {
        try {
            // BLPOP: Blocking List Pop. Waits indefinitely (0 seconds) for an item to appear.
            const [queueName, jobString] = await redis.blpop('video_generation_queue', 0);
            if (jobString) {
                const jobData = JSON.parse(jobString);
                console.log(`Worker: Picked up job ${jobData.jobId} from queue.`);
                // Process the job. Awaiting here means jobs are processed sequentially.
                // For high concurrency, you might use a job queue library like BullMQ or process in a non-blocking way.
                await processJob(jobData.jobId, jobData);
            }
        } catch (error) {
            console.error('Worker: Error while listening for jobs or processing:', error);
            // Implement backoff or specific error handling for Redis connection issues
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
    }
}

startWorker();