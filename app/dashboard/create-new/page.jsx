
'use client'

import React, { useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Loading from './_components/Loading'
import { db } from '@/configs/db'
import { ImageCount, VideoData } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import PlayerDialog from '../_components/PlayerDialog'
import { toast } from "sonner"


// const demoScript = 'The old cemetery was my shortcut home. I should have taken the long way because something was watching me, something from beyond the grave. I ran but it was too late. They rose from their eternal slumber. They closed in, their eyes burning. The air grew cold and my scream was lost in the night. Now I am one of them forever trapped among the shadows of the graveyard.'
// const demoImagePrompt = [
//   "A magical forest with talking animals and a glowing tree in the center.",
//   "A cozy treehouse built high in the branches, surrounded by fireflies at dusk.",
//   "A brave little boy riding a giant turtle across a sparkling blue ocean.",
//   "A whimsical candy village with houses made of chocolate and lollipops.",
//   "A curious girl discovering a hidden door in a garden full of colorful flowers.",
//   "A friendly dragon teaching children how to fly in a sunny meadow."
// ]

const CreateNew = () => {

  const [formData, setFormData] = useState([])
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [videoData, setVideoData] = useState({});
  const [isPlayVideo, setIsPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const { user } = useUser();

  useEffect(() => {

    if (Object.entries(videoData).length === 4) {
      saveVideoData(videoData);
    }

  }, [videoData])

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));

  }

  const onHandleNewVideoCreation = async () => {

    console.log("This is formData:", formData);

    if (Object.entries(formData).length !== 3) {
      toast.warning("Plase select all fields.");
      return
    }

    const imageCount = await getImageCount();

    if (imageCount > 24) {
      toast.warning("Image generation limit is exceed. Please contact to developer.")
      await db.delete().from(ImageCount);
      return
    }

    toast.info("The video generation can take time up to 3 minutes.")
    setIsClicked(true);
    setLoading(true);
    sessionStorage.removeItem("videoListCache");

    try {

      const { script, imagePrompts } = await generateVideoScript();
      setVideoData(prev => ({
        ...prev,
        "script": script
      }));

      if (!script || !imagePrompts) {
        setLoading(false);
        setIsClicked(false);
        toast.error('Error: Internal server error');
        return;
      }

      const audioSuccess = await generateAudio(script);
      if (!audioSuccess) {
        setLoading(false);
        setIsClicked(false);
        toast.error('Error: Internal server error.');
        return;
      }

      const imageSuccess = await generateImage(imagePrompts, imageCount);
      if (!imageSuccess) {
        setLoading(false);
        setIsClicked(false);
        toast.error('Error: Internal server error');
        return;
      }

    } catch (error) {
      setLoading(false);
      setIsClicked(false);
      console.error('An unexpected error occurred during video generation:', error);
      toast.error(`An error occurred: Something went wrong.}`);
    } finally {
      setLoading(false);
      setIsClicked(false);
    }
  }

  // This function will generate the video script using the gemini API based on the user selected topic, style and duration
  const generateVideoScript = async () => {
    const { topic, style, duration } = formData;
    const prompt = `Write a script to generate ${duration} video on topic: ${topic} align with AI Image prompt in ${style} format for each scene and give me result in JSON format with imagePrompt and ContentText as field.`
    // console.log(prompt)
    try {
      const response = await axios.post('/api/get-video-script', {
        prompt: prompt
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      console.log("This is the response data from gemini: ", data);
      const { script, imagePrompts } = distributeScriptAndImagePrompts(data);
      console.log("This is the script: ", script);
      console.log("This is the imagePrompts: ", imagePrompts);
      return { script, imagePrompts };
    } catch (error) {
      console.error('Error generating video script:', error);
      return { script: null, imagePrompts: null };
    }

  }

  // This function will generate the audio and captions using the ElevenLabs API based on the script
  const generateAudio = async (script) => {
    try {
      const response = await axios.post('/api/generate-audio', {
        text: script
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setVideoData(prev => ({
        ...prev,
        "audioFileUrl": response.data.publicUrl,
        "captions": response.data.transcription
      }))

      console.log("This is the response from audio api endpoits: ", response);
      return true;
    } catch (error) {
      console.error('Error generating audio:', error);
      return false;
    }
  }

  // This function will generate the image using the ImagePig API based on the imagePrompts in the script
  const generateImage = async (imagePrompts, imageCount) => {
    try {
      const response = await axios.post('/api/generate-image', {
        prompt: JSON.stringify(imagePrompts)
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setVideoData(prev => ({
        ...prev,
        "imageList": response.data.imageUrls
      }))

      setImageCount(imagePrompts.length, imageCount);
      console.log("This is the image generated response: ", response);
      return true;
    } catch (error) {
      console.error('Error generating image:', error);
      return false;
    }
  }

  // This function will return script and imagePrompts array
  const distributeScriptAndImagePrompts = (data) => {
    const script = data.map(item => item.contentText).join(' ');
    const imagePrompts = data.map(item => item.imagePrompt);
    return { script, imagePrompts };
  }

  // Savind Data to neon database
  const saveVideoData = async (videoData) => {
    try {
      const result = await db.insert(VideoData).values({
        script: videoData?.script,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress
      }).returning({ id: VideoData?.id })

      setVideoId(result[0]?.id)
      console.log(result);
      toast.success("Video saved successfully!");
      setIsPlayVideo(true);
    } catch (error) {
      console.error("Error saving video data:", error);
      toast.error(`Error: something went wrong.}`);
    } finally {
      setLoading(false);
      setIsClicked(false);
    }
  }

  const getImageCount = async () => {
    try {
      const imageCountResult = await db.select().from(ImageCount);
      console.log("Image Count get:", imageCountResult[0]?.count);
      return imageCountResult[0]?.count || 0; // Handle potential undefined
    } catch (error) {
      console.error("Error getting image count:", error);
      toast.error(`Error: something went wrong.'}`);
      return 0;
    }
  }

  const setImageCount = async (count, prevCount) => {
    try {
      const response = await db.insert(ImageCount).values({
        count: prevCount + count,
      });
      console.log("Image Count set:", response);
    } catch (error) {
      console.error("Error setting image count:", error);
      toast.error(`Error: something went wrong'}`);
    }
  }


  return (
    <div className='md:px-5 lg:px-20'>
      <h2 className='font-bold text-4xl text-[#8338ec] text-center'>Create New</h2>

      <div className='mt-10 p-10 shadow-md space-y-6'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />

        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />

        {/* Create button */}
        <Button
          className={`mt-4 hover:bg-[#8833dd] cursor-pointer ${isClicked ? 'cursor-not-allowed bg-[#8833dd]' : 'bg-[#8338ec]'}`}
          onClick={onHandleNewVideoCreation}
          disabled={isClicked}
        >
          {isClicked ? "Generating....." : "Create New video"}
        </Button>

        {/* Loading */}
        <Loading loading={loading} />
        {isPlayVideo && <PlayerDialog playVideo={isPlayVideo} videoId={videoId} setIsPlayVideo={setIsPlayVideo} />}

      </div>
    </div>
  )
}

export default CreateNew