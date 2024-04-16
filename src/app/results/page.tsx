'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const Results = () => {
    const resultSet = useSelector(state => state.result.resultData)
    const videos = resultSet.videos
    console.log(resultSet)
     function formatDuration(durationInSeconds) {
       const hours = Math.floor(durationInSeconds / 3600);
       const minutes = Math.floor((durationInSeconds % 3600) / 60);
       const seconds = Math.floor(durationInSeconds % 60);

       const formattedHours = String(hours).padStart(2, "0");
       const formattedMinutes = String(minutes).padStart(2, "0");
       const formattedSeconds = String(seconds).padStart(2, "0");

       return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
     }

      function timeSince(date: string | Date) {
        const currentDate = new Date();
        const providedDate = typeof date === "string" ? new Date(date) : date;

        const seconds = Math.floor(
          (currentDate.getTime() - providedDate.getTime()) / 1000
        );

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
      }

  return (
    <main className="pt-6 px-4 mr-8">
      <div className="flex items-center justify-start gap-4 mb-8">
        <h1 className="text-4xl font-bold">
          Found {resultSet?.totalCount} Results
        </h1>
      </div>
      <div>
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((video) => (
            <Link href={`/videos/${video._id}`} key={video._id}>
              <div className="px-6 relative flex justify-start items-start gap-4 border-y border-y-slate-500 py-4 my-4 hover:bg-slate-600 rounded-md">
                <p className="absolute right-1 bottom-1">
                  {timeSince(video.createdAt)}
                </p>
                <div className="relative w-68 h-48 mr-4">
                  <Image
                    src={video.thumbnail}
                    width={400}
                    height={300}
                    alt="avatar"
                    className="border border-black rounded-md object-cover h-full w-72"
                    priority
                  />
                  <p className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </p>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <h1 className="text-2xl font-semibold">{video.title}</h1>
                  <div className="flex justify-between items-center gap-3 text-sm">
                    <p>@{video.owner.username}</p>
                    <p>{video.views} views</p>
                  </div>
                  <h1 className="text-lg font-light">{video.description}</h1>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <>
            <Image
              src={`/notFound.jpeg`}
              width={400}
              height={300}
              alt="avatar"
              className="rounded-md object-cover h-full w-full"
              style={{
                backgroundColor: "transparent",
                mixBlendMode: "multiply",
              }}
              priority
            />
          </>
        )}
      </div>
    </main>
  );
}

export default Results