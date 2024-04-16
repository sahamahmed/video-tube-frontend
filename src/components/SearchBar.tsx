'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { Button } from './ui/button';
import axios from 'axios';
import useAccessToken from '../lib/accessToken';
import {passResult} from '../store/resultSlice'
import { useDispatch } from 'react-redux';

const SearchBar = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const accessToken = useAccessToken()
  const dispatch = useDispatch()

    function handleSubmit(event){
            event.preventDefault();

      setLoading(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/videos`, {
          params: {
            sortBy: "createdAt",
            sortType: "desc",
            query: input,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data.data);
          dispatch(passResult(response.data.data))
           router.push(`/results?results=${input}`);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading(false));

     
    }
  return (
    <div>
    
      <form  
        onSubmit={handleSubmit}
        className="m-2 p-2 mx-auto grid grid-cols-12 w-full  rounded-full border"
      >
        <input
          className=" col-span-11 px-2 md:text-xl border-0 bg-transparent text-slate-200  focus:outline-none"
          placeholder="Search Videos"
          value={input}
          onChange={(e)=> setInput(e.target.value)}
        />
          <CiSearch className=" col-span-1 cursor-pointer h-8 w-8" type='submit' />
      </form>
    </div>
  );
}

export default SearchBar