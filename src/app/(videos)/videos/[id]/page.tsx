'use client'
import LoadMore from "../../../../components/LoadMore";
import useAccessToken from '../../../../lib/accessToken'
import axios from 'axios'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { Button } from "../../../../components/ui/button";
import Image from 'next/image'
import VideoComments from "../../../../components/VideoComments";
import VideoLikes from "../../../../components/VideoLikes";
import Link from "next/link";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import SimpleDialogDemo from "../../../../components/AddVideoToPlaylist";

const Videopage = ({params}) => {
    const {id} = params
    const [loading , setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [subscribe, setSubscribe] = useState(false);
    const [data, setData] = useState(null)
    const accessToken = useAccessToken()
  const [channelInfo, setChannelInfo] = useState("");

   useEffect(() => {
     axios
       .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/videos/${id}`, {
         headers: {
           Authorization: `Bearer ${accessToken}`,
         },
       })
       .then((response) => {
        //  console.log("Video data:", response.data.data[0].owner._id);
    setData(response.data.data)      
    fetchChannelData(response.data.data);
   })
       .catch((err) => {           
           setError(true)
       })
       .finally(() => setLoading(false));
   }, [accessToken, id]);

   const fetchChannelData = useCallback((videoData) => {
    if (!videoData || videoData.length === 0) {
      return;
    }
    const userId = videoData[0].owner._id;
     axios
       .get(
         `${process.env.NEXT_PUBLIC_API_ROUTE}/users/c/${userId}`,
         {
           headers: {
             Authorization: `Bearer ${accessToken}`,
           },
         }
       )
       .then((response) => {
        //  console.log(response.data.data);
         setChannelInfo(response.data.data);
         if (response.data.data.isSubscribed) {
          setSubscribe(true);
         }else{
          setSubscribe(false)
         }
       })
       .catch((err) => {
         console.log(err);
       });
   }, [accessToken]);


  function toggleSubscribe(id) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/subscriptions/c/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data.message);
        if (response.data.data == 1) {
          setSubscribe(true);
        setChannelInfo((prev) => ({
          ...prev,
          subscribersCount: prev.subscribersCount + 1,
        }));       
       } else {
          setSubscribe(false);
          setChannelInfo((prev) => ({
            ...prev,
            subscribersCount: prev.subscribersCount - 1,
          }));   
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {loading && (
        <div className="">
          <LoadMore />
        </div>
      )}
      {data && (
        <main className="grid grid-cols-12 min-h-screen ">
          {/* video ,likes,subscribe,channel details description, title, views, createdAt */}
          <div className=" col-span-8 w-full flex flex-col ">
            <div className=" h-fit relative">
              <video
                src={data[0].videoFile}
                className=""
                controls
                autoPlay
              ></video>
            </div>
            <div className=" flex-grow px-4">
              <div className="  my-4  pb-4 border-b border-white relative">
                <h1 className="text-3xl font-bold">{data[0].title}</h1>
                <div className="absolute cursor-pointer top-0 right-4">
                  <SimpleDialogDemo videoId={data[0]._id}>
                    <MdOutlinePlaylistAdd className="w-8 h-8 text-white " />
                  </SimpleDialogDemo>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center">
                {/* channel related info aegi*/}
                <div className="flex flex-row items-center justify-start gap-4">
                  <Link href={`/profile/${data[0].owner._id}`}>
                    <Image
                      src={data[0].owner.avatar}
                      width={50}
                      height={50}
                      alt="avatar"
                      className=" border border-black w-16 h-16 rounded-full object-fit"
                      priority
                    />
                  </Link>
                  <div>
                    <h1 className="text-xl font-bold">
                      {data[0]?.owner.username}
                    </h1>
                    {/* //////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                    <h1 className=" text-sm">{`${channelInfo.subscribersCount} subscribers`}</h1>
                  </div>
                </div>
                {/*  likes and subcribe*/}
                <div className="flex flex-row justify-center items-center gap-3">
                  <div className="pr-4 py-2 flex justify-around gap-3 items-center border-r border-white">
                    <VideoLikes vid={data} />
                  </div>
                  <Button
                    variant={subscribe ? "secondary" : "destructive"}
                    onClick={() => toggleSubscribe(data[0].owner._id)}
                  >
                    {`${subscribe ? "Subscribed" : "subscribe"}`}
                  </Button>
                </div>
              </div>

              {/*views createdAt description  */}
              <div className="flex flex-col my-4 border-t pt-4 gap-4">
                <div className="border-b pb-2 border-b-slate-400">
                  <h1>{data[0]?.views} views</h1>
                  <h1>
                    Uploaded at{" "}
                    {new Date(data[0]?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </h1>
                </div>
                <div>
                  <h1>{data[0]?.description}</h1>
                </div>
              </div>
            </div>
          </div>
          {/* comments */}
          <div className=" col-span-4  w-full">
            <VideoComments videoId={id} />
          </div>
        </main>
      )}
    </>
  );
}

export default Videopage