import React, { useState } from "react";
import Image from "next/image";
import { FiAlignLeft } from "react-icons/fi";
import useAccessToken from "../lib/accessToken";
import axios from "axios";
import Link from "next/link";
import { HiPlusCircle } from "react-icons/hi2";
import PlaylistForm from "./PlaylistForm";

const ChannelPlaylists = ({ id }) => {
  const accessToken = useAccessToken();
  const [playlists, setPlaylists] = useState(null);

  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/user/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setPlaylists(response.data.data);
        // console.log(response.data.data[0].videos[0].thumbnail);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, id]);

  return (
    <div className="max-w-6xl mx-auto px-4 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.isArray(playlists) &&
          playlists.length > 0 &&
          playlists.map((playlist) => (
            <Link key={playlist._id} href={`/playlist/${playlist._id}`}>
              <div className="relative rounded-lg overflow-hidden h-[300px]">
                <h3 className="text-lg font-semibold px-4 py-2 bg-green-800">
                  {playlist.name}
                </h3>
                <div className="relative w-full">
                  <div className=" rounded-md">
                    <Image
                      src={playlist?.videos[0]?.thumbnail || `/default.png`}
                      alt={"image"}
                      height={150}
                      width={100}
                      className="w-full h-[200px] rounded-md"
                    />
                  </div>
                  <div className="absolute right-0 bottom-0 bg-gradient-to-l from-transparent to-gray-500 p-4 w-full">
                    <div className="text-white font-bold flex justify-start items-center gap-2">
                      <FiAlignLeft />
                      <p>{playlist.videos.length} Videos</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <div className="fixed bottom-4 right-4 cursor-pointer text-green-500">
        <PlaylistForm mode={"create"}>
          <HiPlusCircle className="text-5xl h-20 w-20 fixed bottom-4 right-4 cursor-pointer text-green-500" />
        </PlaylistForm>
      </div>
    </div>
  );
};

export default ChannelPlaylists;
