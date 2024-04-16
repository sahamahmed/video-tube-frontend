'use client'
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import useAccessToken from "../lib/accessToken";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MdError } from "react-icons/md";

const VideoForm = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const router = useRouter()  
  const accessToken = useAccessToken();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

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
     if (!title || !description || !thumbnail || !file) {
toast("Please fill all the fields.", {
  className: "bg-red-500 text-white ",
  icon: <MdError />,
  position: "top-center",
});          return;
     }
        setLoading(true);
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("thumbnail", thumbnail);
    data.append("videoFile", file);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_ROUTE}/videos`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        router.back()
        toast.success("Video uploaded successfully.", {
          className: "text-white",
        }); 
      })
      .catch((err) => {
        toast("Failed to upload video.", {
          className: "bg-red-500 text-white",
          icon: <MdError />,
        });   
      })
      .finally(() => setLoading(false));
  };

  if (file) {
    return (
          <div className="max-w-4xl mx-auto px-4 my-4 relative">
            {loading && (
              <div className="loading"></div>
            )}
      <form onSubmit={handleSubmit}>
        {loading && <div className="loading"></div>}
        <div className="flex flex-col justify-center items-center border-4 border-dashed border-gray-400 p-8 mb-4">
          <p>Selected file: {file.name}</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="destructive" onClick={() => setFile(null)}>
              Cancel
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="thumbnail">
            Thumbnail Image:
          </label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            required={true}
            onChange={handleThumbnailChange}
            accept="image/*"
            className="border border-gray-300 p-2 w-full"
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
            required={true}
            value={title}
            onChange={handleTitleChange}
            className="border border-gray-300 p-2 w-full bg-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            required={true}
            value={description}
            onChange={handleDescriptionChange}
            className="border border-gray-300 p-2 w-full bg-transparent"
          />
        </div>
        <Button
          type="button"
          onClick={handleUpload}
          className="font-bold py-2 px-4 rounded mt-4 w-full"
          variant="secondary"
          disabled={loading}
        >
          Upload
        </Button>
      </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 my-4 relative">
      {loading && <div className="loading"></div>}
      <form onSubmit={handleSubmit}>
        <div
          className="flex flex-col justify-center items-center h-96 border-4 border-dashed border-gray-400 p-8 mb-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h1 className="mb-4">Drag and Drop Video File to Upload</h1>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files[0])}
            hidden
            accept="video/*"
            ref={inputRef}
            required={true}
          />
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => inputRef.current.click()}
          >
            Select Video File
          </button>
        </div>

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
          {loading ? "Uploading" : "Upload"}
        </Button>
      </form>
    </div>
  );
};

export default VideoForm;
