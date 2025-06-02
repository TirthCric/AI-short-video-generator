// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
    GoogleGenAI,
  } from '@google/genai';
  
  export async function reqestToModal(prompt) {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
      responseMimeType: 'application/json',
    };
    const model = 'gemini-2.0-flash-lite';
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
  
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    return response;
  }
  
  