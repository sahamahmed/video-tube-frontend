"use client";
import LoadMore from "../../components/LoadMore";
import { Button } from "../../components/ui/button";
import useAccessToken from "../../lib/accessToken";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdHistory } from "react-icons/md";
import { SkeletonHistory } from "../../components/loaders/HistorySkeleton";

const Page = () => {
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const accessToken = useAccessToken();


  function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }



  
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/users/history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // console.log("Video data:", response.data.data);
        setData(response.data.data);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <main className="pt-6 px-4 mr-8">
      {loading && (
        <div className="flex flex-col gap-4">
          <SkeletonHistory />
          <SkeletonHistory />
          <SkeletonHistory />
        </div>
      )}
      <div className="flex items-center gap-4 justify-start mb-8">
        <h1 className="text-4xl font-bold">History</h1>
        <MdHistory className="h-8 w-8" />
      </div>
      <div>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((video) => (
            <Link href={`/videos/${video._id}`} key={video._id}>
              <div
                onMouseEnter={() => setHoveredVideoId(video._id)}
                onMouseLeave={() => setHoveredVideoId(null)}
                className="px-6 relative flex justify-start items-start gap-4 border-y border-y-slate-500 py-4 my-4 hover:bg-slate-600 rounded-md"
              >
                <div className="relative w-[35%] h-48">
                  <Image
                    src={video.thumbnail}
                    width={400}
                    height={300}
                    alt="avatar"
                    className="border border-black rounded-md object-cover h-full"
                    priority
                  />
                  <p className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </p>
                </div>

                <div className="flex flex-col justify-start items-start gap-2 w-[50%] ">
                  <h1 className="text-2xl font-semibold w-[80%] overflow-hidden overflow-ellipsis whitespace-nowrap truncate ">
                    {video.title}
                  </h1>
                  <div className="flex justify-between items-center gap-3 text-sm">
                    <p>@{video.owner.username}</p>
                    <p>{video.views} views</p>
                  </div>
                  <h1 className="text-lg font-light">{video.description}</h1>
                </div>

                <div className="my-auto w-[15%]">
                  {hoveredVideoId === video._id && (
                    <Button
                      className="absolute right-2 bottom-2"
                      variant={"secondary"}
                    >
                      Visit
                    </Button>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h1>No watch History yet</h1>
        )}
      </div>
    </main>
  );
};

export default Page;
