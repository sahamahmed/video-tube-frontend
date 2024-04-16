import React, { useCallback, useEffect, useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import LoadMore from "./LoadMore";
import useAccessToken from "../lib/accessToken";
import axios from "axios";
import CommentLikes from "./CommentLikes";
import EditComment from "./EditComment";
import { GrSubtract } from "react-icons/gr";
import { toast } from "sonner";
import { MdError } from "react-icons/md";
import { SkeletonComment } from "./loaders/CommentSkeleton";
import { Pagination } from "./ui/pagination";
import Paginations from "./Paginations";

const VideoComments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedComments, setlikedComments] = useState([]);
const [length, setLength] = useState(0)
const [reloadComments, setReloadComments] = useState(false);
  const accessToken = useAccessToken();
  const [editMode, setEditMode] = React.useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);

  function toggleEditMode(id) {
    setEditMode((prevEditMode) => ({ ...prevEditMode, [id]: !prevEditMode[id]}));
  }

  function reloadCommentsHandler(){
    setReloadComments((prev) => !prev)
  }


const fetchData = useCallback(
  (page = 1) => {
    setComments([])
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/comments/${videoId}`, {
        params: {
          page,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        const numberOfPages = Math.ceil(
          parseFloat(response.data.data.totalCount) / 5
        );
        console.log('number of pages', numberOfPages)
        setComments(response.data.data.comments);
        setLength(response.data.data.totalCount);
        setlikedComments(response.data.data.MyLikedComments);
        setTotalPages(numberOfPages);
        setCurrentPage(page);
        setHasMore(page * 5 < response.data.data.totalCount);
      })
      .catch((err) => {
        toast("Failed to load comments.", {
          className: "bg-red-500 text-white",
          icon: <MdError />,
        });
      })
      .finally(() => setLoading(false));
  },
  [accessToken , videoId]
);

useEffect(() => {
  fetchData();
}, [fetchData, reloadComments]);

const fetchNextPage = ()=>{
  if(currentPage < totalPages){
    fetchData(currentPage + 1)
  }
}

const fetchPreviousPage = () => {
  if (currentPage > 1) {
    fetchData(currentPage - 1);
  }
};

const fetchCustomPage = (page) => {
  fetchData(page)
}

  function toggleInput() {
    setShowInput((prev) => !prev);
  }

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_ROUTE}/comments/c/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setReloadComments((prev) => !prev);
        }
        toast.success("Comment has been deleted.",{
          className: "text-white"
        });  

      })
      .catch((err) => {
        toast("Failed to delete comment.",{
          className: 'bg-red-500 text-white',
          icon: <MdError />
        });  
      });
  };

  function handleSubmit(e){
     e.preventDefault();

      if (!comment.trim()) {
        alert("Comment cannot be empty");
        return; 
      }
    setLoading(true)
 const data = {
  content: comment  
 }
 axios
   .post(`${process.env.NEXT_PUBLIC_API_ROUTE}/comments/${videoId}`, data, {
     headers: {
       Authorization: `Bearer ${accessToken}`,
     },
     withCredentials: true,
   })
   .then((response) => {
          setReloadComments((prev) => !prev);
          setComment("")
   })
   .catch((err) => {
toast("Failed to add comment.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
});     })
   .finally(() => setLoading(false));
  }

  function timeSince(date: string | Date) {
    const currentDate = new Date();
    const providedDate = typeof date === "string" ? new Date(date) : date;

    const seconds = Math.floor(
      (currentDate.getTime() - providedDate?.getTime()) / 1000
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

  return (
    <main className="m-2 border border-b-0 p-2 min-h-screen">
      <div className="flex justify-between items-center gap-2 p-2">
        <div className="flex justify-start items-center gap-2">
          <FaCommentDots className="h-8 w-8 " />
          <h1>{`Comments (${length})`}</h1>
        </div>
        <div>
          {showInput ? (
            <GrSubtract
              className="h-8 w-8 cursor-pointer"
              onClick={toggleInput}
            />
          ) : (
            <MdAdd className="h-8 w-8 cursor-pointer" onClick={toggleInput} />
          )}
        </div>
      </div>
      {showInput && (
        <form
          onSubmit={handleSubmit}
          className="flex mt-2 justify-center items-center"
        >
          <Input
            type="text"
            name="comment"
            required={true}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comment.."
            className="rounded-tr-none rounded-br-none border border-gray-500 border-r-0"
          />
          <Button
            type="submit"
            className="rounded-tl-none rounded-bl-none border border-gray-500 border-l-0 "
          >
            submit
          </Button>
        </form>
      )}

      {loading && (
        <div className=" flex flex-col gap-3 mt-4">
          <SkeletonComment />
          <SkeletonComment />
          <SkeletonComment />
          <SkeletonComment />
          <SkeletonComment />
        </div>
      )}

      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comm) => (
          <div
            key={comm._id}
            className="flex justify-center items-center h-fit my-4"
          >
            <div className="rounded-md w-full p-1 flex justify-start items-start gap-2">
              <Image
                src={comm.owner.avatar}
                width={50}
                height={50}
                alt="avatar"
                className="border border-black w-8 h-8 rounded-full object-fit"
                priority
              />
              <div
                className="relative rounded-md w-full p-1 pb-8 opacity-85"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-gray-300 text-sm">
                      @{comm.owner.username}
                    </h1>
                    {editMode[comm._id] ? (
                      <EditComment
                        comment={comm}
                        toggle={() => toggleEditMode(comm._id)}
                        reloadComments={reloadCommentsHandler}
                      />
                    ) : (
                      <h1 className="break-words text-wrap overflow-hidden">
                        {comm.content}
                      </h1>
                    )}
                  </div>
                  <h1 className="text-gray-300 text-sm text-nowrap">
                    {timeSince(comm.createdAt)}
                  </h1>
                </div>

                <div className="absolute bottom-0 right-0 ">
                  <CommentLikes
                    comment={comm}
                    likedComments={likedComments}
                    onDelete={handleDeleteComment}
                    onUpdate={() => toggleEditMode(comm._id)}
                  />
                  {/* <MoreVertSharpIcon /> */}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1>No comments yet</h1>
      )}
      <Paginations
        currentPage={currentPage}
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        fetchCustomPage={fetchCustomPage}
      />
    </main>
  );
};

export default VideoComments;
