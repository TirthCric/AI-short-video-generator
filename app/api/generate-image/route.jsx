
import { supabase } from "@/configs/SupabaseClient";
import { NextResponse } from "next/server";
import ImagePig from 'imagepig'
import fs from 'fs/promises'; // Use fs/promises for async file operations
import path from 'path'; // Use path to handle file paths

export async function POST(request) {
    try {
        const { prompt } = await request.json();
        const imagePrompts = JSON.parse(prompt);
        const imagepig = new ImagePig(process.env.IMAGEPIG_API_KEY);
        const imageUrls = [];
        const delayMs = 30 * 1000; // 1 minute in milliseconds

        for (const [index, imagePrompt] of imagePrompts.entries()) {
            try {
                // // Add a delay between requests
                if (index > 0) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }

                const imagepigResponse = await imagepig.xl(imagePrompt);
                const base64Image = imagepigResponse.content.image_data;
                const mimeType = imagepigResponse.mimeType;
                const imageName = `${Date.now()}.jpeg`;
                const imagePath = `images/${imageName}`;
                const buffer = Buffer.from(base64Image, 'base64');

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(imagePath, buffer, { contentType: mimeType });

                console.log("Upload Data:", uploadData);

                if (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    return NextResponse.json({ msg: 'error', error: 'Failed to upload image', details: uploadError }, { status: 500 });
                }

                const { data: publicUrlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(uploadData.path);
                const publicUrl = publicUrlData.publicUrl;
                imageUrls.push(publicUrl);
                console.log("Public URL:", publicUrl);

            } catch (apiError) {
                console.error('Error generating image:', apiError);
                return NextResponse.json({ msg: 'error', error: 'Failed to generate image', details: apiError }, { status: 500 });
            }
        }

        return NextResponse.json({ msg: 'success', imageUrls }, { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ msg: 'error', error: 'An error occurred', details: error }, { status: 500 });
    }
}

// const result = await imageResponse.blob(); // Get the response as a Blob which is a binary representation of the image and it is browser compatible
// const arrayBuffer = await result.arrayBuffer(); // Convert the Blob to an ArrayBuffer which is universal representation of binary data
// const buffer = Buffer.from(arrayBuffer); // Convert the ArrayBuffer to a Node.js Buffer
