"use client"
import { Button } from "@/components/ui/button";
import Header from "./dashboard/_components/Header";
import { ArrowRight, Video } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import DemoList from "@/components/DemoList";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Index } from "drizzle-orm/mysql-core";
// import Image from "next/image";


export default function Page() {
  const { user } = useUser();
  const [dataList, setDataList] = useState(null);
  console.log("datalist first: ", dataList);

  useEffect(() => {
    const cachedDataStr = localStorage.getItem("dataList");
    if (cachedDataStr) {
      try {
        const cachedItem = JSON.parse(cachedDataStr);
        const now = new Date().getTime();
        if (cachedItem?.expiry && now < cachedItem.expiry) {
          setDataList(cachedItem.value);
        } else {
          localStorage.removeItem("dataList");
          getDataList();
        }
      } catch (error) {
        console.error("Error parsing cached data:", error);
        localStorage.removeItem("dataList");
        getDataList();
      }
    } else {
      getDataList();
    }
  }, [user]);

  const getDataList = async () => {
    try {
      const dataList = await db.select().from(VideoData)
        .where(eq(VideoData?.createdBy, "test@gmail.com"));

      setDataList(dataList);
      const now = new Date().getTime();
      const item = {
        value: dataList,
        expiry: now + 3600000,
      };
      localStorage.setItem("dataList", JSON.stringify(item));
      console.log("dataList:", dataList);
      
    } catch (error) {
      console.error("Error from fetching datalist: ", error);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="py-10 px-4 pt-36 flex flex-col items-center gap-10">

        <div className="flex flex-col gap-4 items-center">
          <h1 className="font-bold text-center  text-5xl lg:text-6xl ">Build Your Short Video <span className="text-[#8338ec]">With AI</span></h1>
          <p className="text-xl text-center text-gray-500">Effortlessly Build Ai-Generated Short Videos in Minutes</p>
          <div className="flex items-center gap-4 mt-4">
            <Link href={user ? "/dashboard" : "/sign-in"}>
              <Button className="bg-[#8338ec] font-semibold cursor-pointer text-white hover:bg-[#8833dd] transition-all duration-200 ease-in-out py-6">Get Started <ArrowRight />
              </Button>
            </Link>
            <Button
              variant={"ghost"}
              className="border-2 py-6 shadow-md cursor-pointer font-semibold"
            >
              <Video /> Watch video
            </Button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="font-bold text-3xl">How it works?</h2>
          <div className="flex flex-wrap gap-10 items-center mt-6 justify-center">

            <div className="text-center p-6 border-2 border-gray-300 rounded-2xl w-[280] sm:w-[360px]">
              <h3 className="font-bold text-xl">Select Story Type</h3>
              <p className="text-gray-500 text-lg mt-4">Choose the kind of story you want to tell. This will influence the script and image suggestions.</p>
            </div>

            <div className="text-center p-6 border-2 border-gray-300 rounded-2xl w-[280] sm:w-[360px]">
              <h3 className="font-bold text-xl">Select Image Style</h3>
              <p className="text-gray-500 text-lg mt-4">Pick the visual style for your video's images. This affects the overall look and feel.</p>
            </div>

            <div className="text-center p-6 border-2 border-gray-300 rounded-2xl w-[280] sm:w-[360px]">
              <h3 className="font-bold text-xl">Generate Video</h3>
              <p className="text-gray-500 text-lg mt-4">Select duration of you video and then click the button below to generate your short video!</p>
            </div>

          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="font-bold text-3xl text-wrap">See What You Can Create</h2>
          <div className="grid grid-cols-1 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-6 p-4">
            {
              dataList && dataList.map((data, index) => (
                
                <DemoList key={Index} data={data} />
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}
