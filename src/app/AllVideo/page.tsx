'use client'
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const AllVideo = () => {
  const [data, setData] = useState(null);
  const user = useSelector((state: any) => state.auth.userData);
  const accessToken = user?.accessToken;
  // console.log(user.accessToken)

  function timeSince(date: string| Date) {
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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/videos`,
          {
            params: {
              sortBy: "createdAt",
              sortType: "desc",
            },
            headers: {
              Authorization: `Bearer ${accessToken}`, // Replace accessToken with your actual access token
            },
            withCredentials: true, // Add this line to include cookies
          }
        );

        console.log("Video data:", response.data);
        setData(response.data.data.videos);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
  }, [accessToken]);
  return (
    <main className="min-h-screen p-4 grid grid-cols-3 gap-3">
      {data?.map((vid: any) => (
        <div key={vid._id} className="">
          <Card className=" bg-slate-400 cursor-pointer hover:bg-slate-600">
            <Image
              src={vid.thumbnail}
              alt="thumbnail"
              width={300}
              height={200}
              className="w-full h-[60%] bg-cover"
            ></Image>
            <CardHeader>
              <CardTitle className="mb-4">{vid.title}</CardTitle>
              <div className="flex flex-row justify-start items-center gap-3">
                <Image
                  src={vid.owner.avatar}
                  alt="thumbnail"
                  width={300}
                  height={200}
                  className="w-12 h-12 rounded-full border border-black bg-cover"
                ></Image>
                <CardDescription className="text-slate-900 text-lg font-semibold">
                  {vid.owner.username}
                </CardDescription>
              </div>
            </CardHeader>

            <div className="flex items-center justify-between">
              <CardContent className="">
                <p>{vid.views} views</p>
              </CardContent>
              <CardFooter>
                <p>{timeSince(vid.createdAt)}</p>
              </CardFooter>
            </div>
          </Card>
        </div>
      ))}
    </main>
  );
};

export default AllVideo;
