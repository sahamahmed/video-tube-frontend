import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Image from "next/image";
import Link from "next/link";

const VideoCards = ({ vid }) => {
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
    <Link href={`/videos/${vid._id}`}>
      <Card
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
        }}
        className="opacity-85 cursor-pointer hover:bg-slate-300 hover:opacity-100 h-[24rem] rounded-xl floating-effect border-none relative"
      >
        <div className="relative w-full h-[55%]">
          <Image
            src={vid.thumbnail}
            alt="thumbnail"
            width={300}
            height={200}
            className="w-full h-full bg-cover rounded-tr-xl rounded-tl-xl relative"
          />
          <p className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded">
            {formatDuration(vid.duration)}
          </p>
        </div>
        <CardHeader className="h-[30%]">
          <CardTitle className="mb-4 ">
            <h1 className="text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {vid.title}
            </h1>
          </CardTitle>
          <div className="flex flex-row justify-start items-center gap-2 mb-0 pb-0 relative">
            <Image
              src={vid.owner.avatar}
              alt="thumbnail"
              width={300}
              height={200}
              className="w-10 h-10 rounded-full border border-black bg-cover  "
            />
            <CardDescription className="text-slate-200 text-lg font-semibold">
              {vid.owner.username}
            </CardDescription>
          </div>
        </CardHeader>

        <div className="flex items-center justify-between h-[15%] text-slate-100 pt-2">
          <CardContent className="">
            <p>{vid.views} views</p>
          </CardContent>
          <CardFooter>
            <p>{timeSince(vid.createdAt)}</p>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
};

export default VideoCards;
