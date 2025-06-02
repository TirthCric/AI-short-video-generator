// app/(main)/create-new/_components/CreateNewClient.jsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import SelectTopic from './SelectTopic'; // Relative path within _components
import SelectStyle from './SelectStyle'; // Relative path within _components
import SelectDuration from './SelectDuration'; // Relative path within _components
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Loading from './Loading'; // Relative path within _components
import { toast } from "sonner";
import { useUser } from '@clerk/nextjs'; // Clerk useUser is client-side
import PlayerDialog from '../../_components/PlayerDialog';


const CreateNewClient = () => { // Renamed to CreateNewClient

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [videoData, setVideoData] = useState({}); // This state will be updated by polling
    const [isPlayVideo, setIsPlayVideo] = useState(false);
    const [videoId, setVideoId] = useState(null); // This will be the ID from the `VideoData` table
    const [currentJobId, setCurrentJobId] = useState(null); // State to hold the ID of the background job
    const pollIntervalRef = useRef(null); // useRef to store the interval ID for cleanup

    const { user } = useUser();

    // Effect to save videoData when it's completely populated from the polling
    useEffect(() => {
        // This condition checks if all expected fields are present in videoData
        // console.log("This is videoData in use effect",videoData)
        if (videoData.script && videoData.audioFileUrl && videoData.captions && videoData.imageList) {
            saveVideoData(videoData);
        }
    }, [videoData]);

    // Effect for Polling the Job Status
    useEffect(() => {
        if (currentJobId && user?.primaryEmailAddress?.emailAddress) {
            setLoading(true);
            setIsClicked(true); // Keep button disabled while polling
            toast.info("Video generation started.....");

            // Clear any existing interval before setting a new one
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }

            // Start polling every 10 seconds
            pollIntervalRef.current = setInterval(async () => {
                try {
                    const response = await axios.get(`/api/video-job-status?jobId=${currentJobId}`);
                    const job = response.data;
                    console.log(`Polling Job ${currentJobId}: Status: ${job.status}`);

                    if (job.status === 'COMPLETED') {
                        clearInterval(pollIntervalRef.current); // Stop polling
                        toast.success("Video generated successfully!");

                        // Update videoData state with results from the worker
                        setVideoData({
                            script: job.script,
                            audioFileUrl: job.audioFileUrl,
                            captions: job.captions,
                            imageList: job.imageList,
                        });

                        sessionStorage.removeItem("videoListCache"); // Clear cache if applicable

                    } else if (job.status === 'FAILED') {
                        clearInterval(pollIntervalRef.current); // Stop polling
                        toast.error(`Video generation failed: ${'internal server error'|| 'Unknown error'}`);
                        setLoading(false);
                        setIsClicked(false); // Re-enable button on failure
                        setCurrentJobId(null); // Reset job ID
                    } else {
                        // Still PENDING or PROCESSING, provide update
                        // toast.info(`Video status: ${job.status}... This may take a few minutes.`, { duration: 5000 });
                    }
                } catch (error) {
                    console.error('Error polling job status:', error);
                    clearInterval(pollIntervalRef.current); // Stop polling on error
                    toast.error("Failed to check video status. Please try again.");
                    setLoading(false);
                    setIsClicked(false); // Re-enable button on error
                    setCurrentJobId(null); // Reset job ID
                }
            }, 10000); // Poll every 10 seconds (adjust as needed)

        }

        // Cleanup function: important to clear interval when component unmounts or jobId changes
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [currentJobId, user?.primaryEmailAddress?.emailAddress]);


    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue,
        }));
    };

    const onHandleNewVideoCreation = async () => {
        console.log("This is formData:", formData);

        if (Object.entries(formData).length !== 3) {
            toast.warning("Please select all fields.");
            return;
        }

        toast.info("Initiating video generation. This may take a few minutes...");
        setIsClicked(true); // Disable button immediately
        setLoading(true); // Show loading
        sessionStorage.removeItem("videoListCache");

        try {
            // Call the new API route to START the background job
            const response = await axios.post('/api/start-video-job', {
                formData: formData,
                userEmail: user?.primaryEmailAddress?.emailAddress
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            const { msg, jobId, status } = response.data;

            if (msg === 'success' && jobId) {
                setCurrentJobId(jobId); // Set the job ID to trigger the polling useEffect
            } else {
                toast.error('Failed to initiate video job.');
                setLoading(false);
                setIsClicked(false);
            }

        } catch (error) {
            setLoading(false);
            setIsClicked(false);
            console.error('An unexpected error occurred during job initiation:', error);
            toast.error(`An error occurred: Failed to initiate video job.`);
        }
    };

    // saveVideoData - Now calls the new /api/save-final-video route
    const saveVideoData = async (videoDataToSave) => {
        if (!user?.primaryEmailAddress?.emailAddress) {
            toast.error("User email not found. Cannot save video.");
            setLoading(false);
            setIsClicked(false);
            return;
        }
        try {
            const response = await axios.post('/api/save-final-video', videoDataToSave, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            const { msg, videoId: savedVideoId } = response.data;

            if (msg === 'success' && savedVideoId) {
                setVideoId(savedVideoId); // Set the videoId for the PlayerDialog
                setIsPlayVideo(true); // Open the player dialog
            } else {
                toast.error(`Error: Failed to save video data.`);
            }
        } catch (error) {
            console.error("Error saving video data to DB via API:", error);
            toast.error(`Error: Failed to save video data.`);
        } finally {
            setLoading(false);
            setIsClicked(false);
            setCurrentJobId(null); // Reset job ID after final save/display
        }
    };


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

                {/* Loading spinner */}
                <Loading loading={loading} />
                {/* Video Player Dialog */}
                {isPlayVideo && <PlayerDialog playVideo={isPlayVideo} videoId={videoId} setIsPlayVideo={setIsPlayVideo} />}

            </div>
        </div>
    );
};

export default CreateNewClient;