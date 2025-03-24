'use client'
import useAccessToken from '../lib/accessToken';
import axios from 'axios';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react'
import LoadMore from './LoadMore';
import { Button } from './ui/button';
import { SkeletonDemo } from './loaders/ProfileSkeleton';

const ChannelDashboard = ({id}) => {
     const [info, setInfo] = useState(null);
     const [loading, setLoading] = useState(true);
       const [channelInfo, setChannelInfo] = useState("");
       const [run , setRun] = useState(false)
    const [subscribe, setSubscribe] = useState(false);
     const accessToken = useAccessToken();

 const fetchChannelData = useCallback(() => {
   axios
     .get(
       `${process.env.NEXT_PUBLIC_API_ROUTE}/users/c/${id}`,
       {
         headers: {
           Authorization: `Bearer ${accessToken}`,
         },
       }
     )
     .then((response) => {
       setChannelInfo(response.data.data);
      //  console.log(response.data.data)
       if (response.data.data.isSubscribed) {
         setSubscribe(true);
       } else {
         setSubscribe(false);
       }
     })
     .catch((err) => {
       console.log(err);
     });
 }, [accessToken]);

   const toggleSubscribe = useCallback((id) => {
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
          setChannelInfo(response.data.data)
           setSubscribe(true);
         } else {
           setSubscribe(false);
         }
         setRun(prev => !prev)
       })
       .catch((err) => {
         console.log(err);
       });
   }, [accessToken]);


     useEffect(() => {
       axios
         .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/dashboard/${id}/stats`, {
           headers: {
             Authorization: `Bearer ${accessToken}`,
           },
           withCredentials: true,
         })
         .then((response) => {
           setInfo(response.data.data);
          //  console.log('result', response.data.data )
           fetchChannelData()
         })
         .catch((err) => {
           console.log(err);
         })
         .finally(() => setLoading(false));
     }, [accessToken , fetchChannelData, run]);

    

// console.log("info: ", info)
  return (
    <>
      {loading && (
          <SkeletonDemo />
      )}
      <div className="flex justify-start items-center gap-8  border-b border-b-slate-100 py-8">
        {info && (
          <>
            <div>
              <Image
                src={info.ownerInfo.avatar}
                width={400}
                height={300}
                alt="avatar"
                className="border border-black h-44 w-44 object-fit rounded-full"
                priority
              />
            </div>

            <div className="flex-col items-start justify-start gap-2">
              <h1 className=" text-4xl font-bold">{info.ownerInfo.username}</h1>
              <h1 className=" text-xl font-semibold">{`${info.ownerInfo.fullName} . ${info.NumberOfSubscribers} subscribers `}</h1>
              <h1 className=" text-md ">
                {`${info.NumberOfVideos} videos . ${info.NumberOfLikes.totalLikes} likes . ${info.TotalViews} views`}
              </h1>
              <Button
                variant={subscribe ? "secondary" : "destructive"}
                onClick={() => toggleSubscribe(info.ownerInfo._id)}
                className="mt-4 text-base"
              >
                {`${subscribe ? "Subscribed" : "subscribe"}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ChannelDashboard