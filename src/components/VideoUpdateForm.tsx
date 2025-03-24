"use client";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "./ui/button";
import axios from "axios";
import useAccessToken from "../lib/accessToken";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdError } from "react-icons/md";
import { toast } from "sonner";

const VideoUpdateForm = ({id}) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("")
  const accessToken = useAccessToken();
  const router = useRouter()

   useEffect(() => {
     axios
       .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/videos/${id}`, {
         headers: {
           Authorization: `Bearer ${accessToken}`,
         },
       })
       .then((response) => {
        setData(response.data.data[0].thumbnail)
         setTitle(response.data.data[0].title);
         setDescription(response.data.data[0].description);
        //  console.log(response.data.data[0].title);
       })
       .catch((err) => {
console.log(err)       
})
       .finally(() => setLoading(false));
   }, [accessToken, id]);

  const handleThumbnailChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleUpload = () => {
    if (!title || !description || !thumbnail) {
toast("Please fill all the fields.", {
  className: "bg-red-500 text-white ",
  icon: <MdError />,
  position: "top-center"
});      
  return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("title", title);  
    data.append("description", description);
    data.append("thumbnail", thumbnail);

    axios
      .patch(`${process.env.NEXT_PUBLIC_API_ROUTE}/videos/${id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
toast.success("Video updated successfully.", {
  className: "text-white",
});        })
      .catch((err) => {
toast("Failed to update video.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
});        })
      .finally(() => setLoading(false));
  };

 

  return (
    <>
      <button onClick={()=> router.back()}>
        <ArrowBackIcon className="h-16 w-16"/>
      </button>
      <div className="max-w-4xl mx-auto px-4 my-4 relative">
        {loading && <div className="loading"></div>}
        <div className="mb-4">
          <label className="block mb-2" htmlFor="thumbnail">
            Current Thumbnail:
          </label>
          <Image
            id="thumbnail"
            src={data}
            width={100}
            height={100}
            alt="avatar"
            className=" border border-black w-24 h-24 rounded-full object-fit"
            priority
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="thumbnail">
              Thumbnail Image:
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleThumbnailChange}
              accept="image/*"
              className="border border-gray-300 p-2 w-full"
              required={true}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="title">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="border border-gray-300 p-2 w-full bg-transparent"
              required={true}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              className="border border-gray-300 p-2 w-full bg-transparent"
              required
            />
          </div>
          <Button
            type="button"
            onClick={handleUpload}
            className={`font-bold py-2 px-4 rounded mt-4 w-full `}
            variant="secondary"
            disabled={loading}
          >
            {loading ? "Updating" : "Update"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default VideoUpdateForm;
