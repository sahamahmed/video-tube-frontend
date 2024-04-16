import useAccessToken from "../lib/accessToken";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

const VideoLikes = ({ vid }) => {
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [message, setMessage] = useState(false);
  const [dislike, setDisLike] = useState(false);

  const accessToken = useAccessToken();
  //   console.log(vid)

  function toggleLike(id) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/likes/toggle/v/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setNumberOfLikes(response.data.data);
        console.log(response.data.message);
        if (response.data.message == 1) {
          setMessage(true);
        } else {
          setMessage(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function toggleDisLike() {
    setDisLike((prev) => !prev);
  }

  useEffect(() => {
    setNumberOfLikes(vid[0].likes);
    if (vid[1]?.isLiked.length > 0) {
      setMessage(true);
    } else {
      setMessage(false);
    }
  }, []);

  return (
    <div className="px-4 py-2 flex  justify-center gap-2 items-center ">
      <div onClick={() => toggleLike(vid[0]._id)}>
        {message ? (
          <ThumbUpAltIcon className="cursor-pointer " />
        ) : (
          <ThumbUpOffAltIcon className="cursor-pointer " />
        )}
      </div>
      <h1 className="text-sm">{numberOfLikes}</h1>
      <div className="text-white">|</div>
      <div onClick={toggleDisLike}>
        {dislike ? (
          <ThumbDownAltIcon className="cursor-pointer " />
        ) : (
          <ThumbDownOffAltIcon className="cursor-pointer " />
        )}
      </div>
    </div>
  );
};

export default VideoLikes;
