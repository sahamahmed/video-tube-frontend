"use client";
import axios from "axios";

import { useCallback, useEffect, useState } from "react";
import useAccessToken from "../lib/accessToken";
import LoadMore from "../components/LoadMore";
import VideoCards from "../components/VideoCards";
import { HiPlusCircle } from "react-icons/hi2";
import Link from "next/link";
import React from "react";
import { SkeletonCard } from "./loaders/VideoSkeleton";
import { Pagination } from "./ui/pagination";
import Paginations from "./Paginations";

const AllVideo = () => {
  const [data, setData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const accessToken = useAccessToken();

  
  const fetchData = useCallback((page = 1) => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/videos`, {
        params: {
          page,
          sortBy: "createdAt",
          sortType: "desc",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        const newData = response.data.data.videos;
         const numberOfPages = Math.ceil(
           parseFloat(response.data.data.totalCount) / 6
         );
          setData(newData); 
        setTotalPages(numberOfPages);
        setCurrentPage(page);
        setHasMore(page*6 < response.data.data.totalCount);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

   useEffect(() => {
     fetchData();
   }, [fetchData]);


  const fetchNextPage = () => {
    if (currentPage < totalPages) {
      fetchData(currentPage + 1);
    }
  };

  const fetchPreviousPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1)
    }
  }

  const fetchCustomPage = (page)=> {
    fetchData(page)
  }

  // console.log(currentPage)
  return (
    <main>
      <div className={` p-4 grid grid-cols-3 gap-4 relative my-4 `}>
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {data &&
          data.map((vid) => (
            <div key={vid._id} className="">
              <VideoCards vid={vid} />
            </div>
          ))}
      </div>

      <Paginations
        currentPage={currentPage}
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        fetchCustomPage={fetchCustomPage}
      />

      <Link
        className="fixed bottom-4 right-4 cursor-pointer text-green-500"
        href={`/upload-video`}
      >
        <HiPlusCircle className="text-5xl h-20 w-20" />
      </Link>
    </main>
  );
};

export default AllVideo;

