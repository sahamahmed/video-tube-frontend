import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Switch from "./ToggleButton";
import React, { useState } from "react";
import useAccessToken from "../lib/accessToken";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";

const ChannelVideos = ({id}) => {
  const [info, setInfo] = useState([]);
  const accessToken = useAccessToken();
  const [toggleCount, setToggleCount] = useState(0);
  const userDetails = useSelector((state: any) => state.auth.userData);
  const owner = userDetails._id == id


  function handleDelete(id) {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_ROUTE}/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setToggleCount((prevCount) => prevCount + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

// console.log(userDetails._id == id)
  React.useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/dashboard/${id}/videos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setInfo(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, toggleCount, id]);

  return (
    
    <div className="h-screen ">
      {Array.isArray(info) && info.length > 0 ? (
        <div className="bg-yellow-600 ">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-700 text-white text-start">
                <th className="w-1/12 px-4 py-2">ID</th>
                <th className="w-2/12 px-4 py-2">Title</th>
                <th className="w-2/12 px-4 py-2">Views</th>
                <th className="w-3/12 px-4 py-2">Uploaded At</th>
                {owner && (
                  <>
                    <th className="w-2/12 px-4 py-2">Status</th>
                    <th className="w-2/12 px-4 py-2">Publish</th>
                    <th className="w-2/12 px-4 py-2">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {info.map((video, index) => (
                <tr key={index} className="bg-slate-700">
                  <td className=" px-4 py-2">{index + 1}</td>

                  <td className=" px-4 py-2 font-semibold text-center flex justify-start gap-2 items-center">
                    <Image
                      src={video.thumbnail}
                      width={400}
                      height={300}
                      alt="avatar"
                      className="border border-black h-8 w-8 object-fit rounded-full"
                      priority
                    />
                    {video.title}
                  </td>
                  <td className=" text-center px-4 py-2">{video.views}</td>
                  <td className=" text-center py-2">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </td>

                  {owner && (
                    <>
                      <td className=" px-4 py-2">
                        {video.isPublished ? "Published" : "Not Published"}
                      </td>
                      <td className=" px-4 py-2">
                        <Switch
                          isPublished={video.isPublished}
                          id={video._id}
                          onToggle={() =>
                            setToggleCount((prevCount) => prevCount + 1)
                          }
                        />
                      </td>
                      <td className="borderflex flex justify-center items-center gap-2 pt-3">
                        <Link href={`/update-video/${video._id}`}>
                          <FaEdit className="text-white h-6 w-6" />
                        </Link>
                        <RiDeleteBin5Line
                          className="text-red-700 h-6 w-6"
                          onClick={() => handleDelete(video._id)}
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default ChannelVideos;
