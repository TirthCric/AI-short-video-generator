
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import EmptyList from "./_components/EmptyList";
import Link from "next/link";
import VideoList from "./_components/VideoList";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { UserProfile, useUser } from "@clerk/nextjs";
// import Image from "next/image";


export default function Page() {
  const [videoListData, setVideoListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // const user = "test@gmail.com"

  useEffect(() => {
    const videoListCache = sessionStorage.getItem("videoListCache");
    if (videoListCache) {
      setVideoListData(JSON.parse(videoListCache));
      setIsLoading(false);
    } else {
      getVideoList();
    }
  }, [user])

  const getVideoList = async () => {
    const result = await db.select().from(VideoData)
      .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress));
    setVideoListData(result);
    sessionStorage.setItem("videoListCache", JSON.stringify(result));
    setIsLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-normal sm:justify-between ">
        <h2 className="font-semibold text-xl text-[#8338ec]">Dashbboard</h2>
        <Link href="/dashboard/create-new" className="hidden sm:block">
          <Button className="bg-[#8338ec] cursor-pointer font-semibold text-white hover:bg-[#8833dd]">
            Create New
          </Button>
        </Link>
      </div>
      {videoListData.length === 0 ? (<div>
        <EmptyList />
      </div>) : (
        <VideoList videoListData={videoListData} />
      )}

      <Link href="/dashboard/create-new" className="mt-10 block sm:hidden">
        <Button className=" bg-[#8338ec] cursor-pointer font-semibold text-white hover:bg-[#8833dd]">
          Create New
        </Button>
      </Link>

    </div>
  );
}
