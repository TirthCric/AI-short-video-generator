import { reqestToModal } from '@/configs/AIModal.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { prompt } = requestBody;

    const stream = await reqestToModal(prompt);
    let generatedText = '';
    for await (const chunk of stream) {
      generatedText += chunk.text;
    }

    const jsonResponse = JSON.parse(generatedText);

    return NextResponse.json(jsonResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error generating video script:', error);
    return NextResponse.json(
      { error: 'Failed to generate video script' },
      { status: 500 }
    );
  }
}