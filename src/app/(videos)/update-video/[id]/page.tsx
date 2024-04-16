import React from "react";
import VideoUpdateForm from "../../../../components/VideoUpdateForm";

const Page = ({params}) => {
  const {id} = params
  return (
    <div className="p-6 mx-8">
      <h1 className="text-4xl text-gray-200 text-center mb-8">
        Update Video
      </h1>
      <VideoUpdateForm id={id}/>
    </div>  
  );
};

export default Page;
