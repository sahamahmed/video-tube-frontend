import React, { useState } from 'react'
import { Input } from './ui/input';
import { MdError, MdOutlineDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import useAccessToken from "../lib/accessToken";
import { toast } from 'sonner';

const EditComment = ({comment, toggle , reloadComments}) => {
    const [updatedContent, setUpdatedContent] = useState(comment.content)
      const accessToken = useAccessToken();

    function handleUpdate(e) {
         e.preventDefault();
      if (!updatedContent.trim()) {
        alert("Comment cannot be empty");
        return; 
      }
    const data = {
  content: updatedContent
  }
 axios
   .patch(`${process.env.NEXT_PUBLIC_API_ROUTE}/comments/c/${comment._id}`, data, {
     headers: {
       Authorization: `Bearer ${accessToken}`,
     },
     withCredentials: true,
   })
   .then((response) => {
    // console.log(response.data)
    reloadComments()

   })
   .catch((err) => {
toast("Failed to edit comment.", {
  className: "bg-red-500 text-white ml-2",
  icon: <MdError />,
});     }) 
   .finally(() => toggle())
      };

  return (
    <form
      onSubmit={handleUpdate}
      className="relative flex justify-between items-center mt-2 "
    >
      <Input
        type="text"
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
        className=""
      />
      <div className="absolute bottom-2 right-1  flex justify-center items-center gap-2">
        <button type="submit">
          <MdOutlineDone className="cursor-pointer h-4 w-4" />
        </button>
        <RxCross2 onClick={() => toggle()} className="cursor-pointer h-4 w-4" />
      </div>
    </form>
  );
}

export default EditComment