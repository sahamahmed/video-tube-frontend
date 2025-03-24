'use client'

import React, { useState, useEffect } from "react";
import useAccessToken from "../lib/accessToken";
import axios from "axios";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { SkeletonDemo } from "./loaders/ProfileSkeleton";

const Subscriptions = () => {
  const [info, setInfo] = useState([]);
  const accessToken = useAccessToken();
  const userDetails = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/subscriptions/u/${userDetails?._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setInfo(response.data.data);
        // console.log(response.data.data)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=> {
        setLoading(false)
      })
  }, [accessToken, userDetails]);

  return (
    <main className="h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Your Subscribed Channels</h1>
      {loading && (
        <div className="flex flex-col gap-4 justify-start items-start">
          <SkeletonDemo />
          <SkeletonDemo />
        </div>
      )}

      {Array.isArray(info) && info.length > 0 ? (
        info.map((channel) => (
          <div key={channel._id}>
            <Link href={`/profile/${channel.channel?._id}`}>
              <div className=" px-4 relative flex justify-start items-center gap-4 border-y border-y-slate-500 py-4 my-4 hover:bg-slate-600 rounded-md">
                <Image
                  src={channel.channel?.avatar}
                  width={400}
                  height={300}
                  alt="avatar"
                  className="border border-black object-fit rounded-full h-48 w-48"
                  priority
                />
                <div className="flex flex-col justify-start items-start gap-2 ">
                  <h1 className="text-2xl font-semibold">
                    {channel.channel?.username}
                  </h1>
                  <div className="flex justify-between items-center gap-3 text-sm">
                    <p>{channel.channel?.fullName}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <h1>No subscriptions</h1>
      )}
    </main>
  );
};

export default Subscriptions;
