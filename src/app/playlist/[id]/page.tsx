'use client'
import React, { useState, useEffect } from "react";
import useAccessToken from "../../../lib/accessToken";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { useRouter } from "next/navigation"; 
import PlaylistForm from "../../../components/PlaylistForm";
import { MdCancel } from "react-icons/md";
import { FiAlignLeft } from "react-icons/fi";
import { useSelector } from "react-redux";

const PlaylistPage = ({ params }) => {
  const { id } = params;
  const accessToken = useAccessToken();
  const [playlist, setPlaylist] = useState(null);
  const router = useRouter();
  const userDetails = useSelector((state) => state.auth.userData);
  const [run, setRun] = useState(false);

  function handleDelete() {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        router.back();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleRemoveVideo(videoId) {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/remove/${videoId}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        // console.log(response.data);
        setRun((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setPlaylist(response.data.data[0]);
        console.log(response.data.data[0].videos[0].duration);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, id, run]);

  return (
    <main className="grid grid-cols-12 w-full h-screen opacity-90">
      {playlist && (
        <>
          <div
            className="col-span-4 relative"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className=" border-b border-b-white">
              <h2 className=" m-6 text-3xl font-semibold mb-4">
                {playlist.name}
              </h2>
              <div className=" relative pt-2 border-b border-b-white">
                <Image
                  src={playlist.videos[0]?.thumbnail || "/default.png"}
                  alt={"image"}
                  width={100}
                  height={100}
                  priority
                  className=" w-full h-full relative"
                />
                <div className="absolute right-0 bottom-0 bg-gradient-to-l from-transparent to-gray-500 p-4 w-full h-[45%]">
                  <div className="text-black font-bold flex justify-start items-center gap-2">
                    <FiAlignLeft />
                    <p>{playlist.videos?.length} Videos</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-200 text-lg font-semibold mx-6 my-4">
                {playlist.description}
              </p>
            </div>

            <div className="p-6 flex items-center gap-4 relative">
              <Image
                src={playlist.owner[0]?.avatar || "/default.png"}
                alt={playlist.owner[0]?.username}
                width={100}
                height={100}
                priority
                className="rounded-full h-24 w-24"
              />{" "}
              <div>
                <h2 className="text-2xl font-semibold">
                  <span>Playlist by @</span>
                  {playlist.owner[0]?.username}
                </h2>
                <h1>
                  Published at{" "}
                  {new Date(playlist.createdAt).toLocaleDateString()}
                </h1>
              </div>
            </div>

            {userDetails._id == playlist.owner[0]._id && (
              <div className="p-6 flex justify-center items-center gap-3">
                <PlaylistForm id={id} mode={"edit"}>
                  <Button variant="default" className="rounded-2xl">
                    Update Details
                  </Button>
                </PlaylistForm>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="destructive" className="rounded-2xl">
                      Delete Playlist
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-500">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this playlist?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-200">
                        This action is irreversible
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-600 text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white hover:bg-red-700"
                        onClick={handleDelete}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          <div className="col-span-8 p-6 ">
            {Array.isArray(playlist.videos) && playlist.videos.length > 0 ? (
              playlist.videos.map((video) => (
                <div
                  key={video._id}
                  className=" relative  mb-4 border-b border-b-gray-400 py-4 px-2 hover:bg-slate-700"
                >
                  <p className="absolute right-1 bottom-1">
                    {timeSince(video.createdAt)}
                  </p>
                  <Link
                    href={`/videos/${video._id}`}
                    className="flex flex-row items-start space-x-4"
                  >
                    <div className="relative w-64 h-40">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        priority
                      />
                      <p className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </p>{" "}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{video.title}</h3>
                      <h1>@{video.owner[0]?.username}</h1>
                      <p>{video.views} views</p>
                      {/* <h1>{video.duration}</h1> */}
                    </div>
                  </Link>
                  {userDetails._id == playlist.owner[0]._id && (
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <MdCancel className="absolute top-2 right-1" />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-500">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to remove this video from
                            playlist?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-600 text-white">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 text-white hover:bg-red-700"
                            onClick={() => handleRemoveVideo(video._id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))
            ) : (
              <h1>No Videos</h1>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default PlaylistPage;
