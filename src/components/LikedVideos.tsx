'use client'
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useAccessToken from "../lib/accessToken";
import Link from "next/link";
import { FiAlignLeft } from "react-icons/fi";

const LikedVideos = () => {
  const accessToken = useAccessToken();
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/likes/videos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        const filteredVideos = response.data.data.filter((like) => like.video);
        setVideos(filteredVideos);
        console.log(filteredVideos[0].video.thumbnail);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  

  return (
    <main className="grid grid-cols-12 w-full h-screen">
      <>
        <div
          className="col-span-4 relative  opacity-85 rounded-md"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="p-6 border-b border-b-white">
            <h2 className="text-2xl font-semibold my-4">{`LikedVideos`}</h2>
          </div>

          {videos && videos.length > 0 && (
            <div className=" relative pt-2 border-b border-b-white">
              <Image
                src={videos[0].video.thumbnail}
                alt={videos[0].video.title}
                width={100}
                height={100}
                priority
                className=" w-full h-full relative"
              />
             
              <div className="absolute right-0 bottom-0 bg-gradient-to-l from-transparent to-gray-500 p-4 w-full h-[45%]">
                <div className="text-black font-bold flex justify-start items-center gap-2">
                  <FiAlignLeft />
                  <p>{videos.length} Videos</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-8 p-6 ">
          {videos &&
            videos.map((like) => (
              <div
                key={like._id}
                className=" relative  mb-4 border-b border-b-gray-400 py-4 px-2 hover:bg-slate-700"
              >
                <Link
                  href={`/videos/${like.video._id}`}
                  className="flex flex-row items-start space-x-4 rounded-md"
                >
                  <div className="relative w-64 h-40">
                    <Image
                      src={like.video.thumbnail}
                      alt={like.video.title}
                      layout="fill"
                      objectFit="cover"
                      priority
                      className="w-full h-full rounded-md"
                    />
                    <p className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                      {formatDuration(like.video.duration)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {like.video.title}
                    </h3>
                    <h1>
                      @{like.video.owner.username} . {like.video.views} views
                    </h1>
                    {/* <h1>{like.video.duration}</h1> */}
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </>
    </main>
  );
};

export default LikedVideos;
