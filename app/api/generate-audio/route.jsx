
import { ElevenLabsClient } from 'elevenlabs';
import { NextResponse } from 'next/server';
import { supabase } from '@/configs/SupabaseClient';
import { v4 as uuid } from 'uuid';

export async function POST(request) {

    const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    // const text = 'Hey, this is Jennifer from Play. Please hold on a moment, let me just um pull up your details real quick.';
    const { text } = await request.json();
    if (!text) {
        return NextResponse.json({ msg: 'error', error: 'Text is required' }, { status: 400 });
    }

    const client = new ElevenLabsClient({
        apiKey: ELEVENLABS_API_KEY,
    });

    try {

        // Generate audio using ElevenLabs API
        const audio = await client.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
            model_id: 'eleven_multilingual_v2',
            text: text,
            output_format: 'mp3_44100_128',
            // Optional voice settings that allow you to customize the output
            voice_settings: {
                stability: 0,
                similarity_boost: 0,
                use_speaker_boost: true,
                speed: 1.0,
            },
        });

        // const fileName = `output.mp3`;
        // const fileStream = createWriteStream(fileName);

        // // Use pipeline to handle stream completion and errors properly
        // await pipeline(audio, fileStream);

        // convert the readable stream to a buffer
        const chunk = [];
        const reader = audio.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            chunk.push(value);
        }

        const audioBuffer = Buffer.concat(chunk);
        const filePath = `audio/${uuid()}.mp3`; // Generate a unique filename

        // Upload the audio file to Supabase storage
        const { data:uploadData, error:uploadError } = await supabase.storage
            .from('audio')
            .upload(filePath, audioBuffer, {
                contentType: 'audio/mpeg', // Specify the correct MIME type
            });

        // Check if the upload was successful and get the public URL
        let publicUrl = null;
        if (uploadData) {
            const { data: publicUrlData } = supabase.storage
                .from('audio')
                .getPublicUrl(uploadData.path);
            publicUrl = publicUrlData.publicUrl;
        }

        // Generate caption file from ElevenLabs API
        const response = await fetch(
            publicUrl, // Use the public URL of the uploaded audio file
          );

        //   console.log("This is the response from fetch public url: ", response);
          const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });
            // console.log("This is the audio blob: ", audioBlob);
          const transcription = await client.speechToText.convert({
            file: audioBlob,
            model_id: "scribe_v1", // Model to use, for now only "scribe_v1" is support.
            tag_audio_events: true, // Tag audio events like laughter, applause, etc.
            language_code: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
            diarize: true, // Whether to annotate who is speaking
          });

        //   console.log("This is transcription",transcription);

        if (uploadError) {
            console.error('Error uploading to Supabase:', uploadError);
            return NextResponse.json({ msg: 'error', error: uploadError.message }, { status: 500 });
        }

        // console.log('Audio uploaded to Supabase:', uploadData);
        // console.log('Public URL:', publicUrl);
        return NextResponse.json({ msg: 'success', publicUrl, transcription }, { status: 200 });
    } catch (error) {
        console.error('Error in audio generation: ', error);
        return NextResponse.json({ msg: 'error', error: error.message }, { status: 500 });
    }
}
