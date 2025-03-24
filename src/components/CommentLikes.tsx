import useAccessToken from "../lib/accessToken";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LongMenu from "./CommentMenu";
import { comment } from "postcss";
import { useSelector } from "react-redux";

const CommentLikes = ({ comment, likedComments , onDelete , onUpdate }) => {
  const userDetails = useSelector((state: any) => state.auth.userData);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [message, setMessage] = useState("")
  const accessToken = useAccessToken();
  // console.log(likedComments)

  function toggleLike(id) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/likes/toggle/c/${id}`,
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
        // console.log(response.data)
        setMessage(response.data.message);
    
      })
      .catch((err) => {
        console.log(err);
      });
  }

  
  useEffect(()=>{
    function test() {
      setNumberOfLikes(comment.likeCount);
      const likedComment = likedComments.filter(
        (liked) => liked.comment == comment._id
      );
      if (likedComment.length > 0) {
        setMessage("liked");
      } else {
        setMessage("disliked");
      }
    }
    test()
  },[])
  return (
    <div className="px-2 py-2 flex  justify-center items-center ">
      <div className="flex justify-between items-center ">
        <div className="flex justify-center items-center gap-2">
          <div onClick={() => toggleLike(comment._id)}>
            {message == "liked" ? (
              <ThumbUpAltIcon className="cursor-pointer " />
            ) : (
              <ThumbUpOffAltIcon className="cursor-pointer " />
            )}
          </div>
          <h1 className="text-sm">{numberOfLikes}</h1>
        </div>
        {userDetails.username == comment.owner.username && (
          <LongMenu
            onDelete={onDelete}
            commentId={comment._id}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default CommentLikes;
