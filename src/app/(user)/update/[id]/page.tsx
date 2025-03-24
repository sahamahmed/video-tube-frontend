'use client'
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import useAccessToken from "../../../../lib/accessToken";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FilterIcon from "@mui/icons-material/Filter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../../../../store/authSlice";
import { toast } from "sonner";
import { MdError } from "react-icons/md";

const Update = () => {
    const [data, setData] = useState("")
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading ] = useState(false)
    const [run, setRun] = useState(false)
    const accessToken = useAccessToken();
    const dispatch = useDispatch()

    useEffect(()=>{
        axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}/users/current-user` , 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        )
        .then((response)=>{
            setData(response.data.data)
            setEmail(response.data.data.email)
            setFullName(response.data.data.fullName);

            console.log(response.data.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }, [accessToken, dispatch , run])

    const updateDetails = async(event: { preventDefault: () => void; }) => {
      event.preventDefault()
      if (email.trim() == "" || fullName.trim() == "") {
        toast("Please fill all the fields.", {
          className: "bg-red-500 text-white ",
          icon: <MdError />,
          position: "top-center",
        });
        return
      }
            setLoading(true);

      const data = {
        email: email,
        fullName: fullName
      }
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/users/update-account`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dispatch(storeLogin(response.data.data))
        setRun(prev => !prev)
        toast.success("Details updated successfully.", {
          className: "text-white",
        });  
        } catch (error) {
toast("Failed to update details.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
});   
}   
setLoading(false)
 }

    const updateCoverImage = async (event: { preventDefault: () => void; target: HTMLFormElement | undefined; }) => {
      event.preventDefault();
            setLoading(true);
      const formData = new FormData(event.target);
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/users/cover-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dispatch(storeLogin(response.data.data))
        setRun((prev) => !prev);
        toast.success("Cover Image updated successfully.", {
          className: "text-white",
        });  
      } catch (error) {
toast("Failed to update cover image.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
});         }
setLoading(false)
    };

    const updateAvatar = async (event: { preventDefault: () => void; target: HTMLFormElement | undefined; }) =>{
      event.preventDefault();
            setLoading(true);

      const formData = new FormData(event.target);

      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/users/avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dispatch(storeLogin(response.data.data));
        setRun((prev) => !prev);
        toast.success("Avatar updated successfully.", {
          className: "text-white",
        });  
      } catch (error) {
toast("Failed to update avatar.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
});         }
      setLoading(false);

    }



  return (
    <div className="grid grid-rows-12 w-full h-screen">
      {loading && <div className="loading"></div>}
      {/* COVER IMAGE KI DIV  */}
      <div className="relative row-span-5 bg-gray-900">
        <Image
          src={data.coverImage || "/default.png"}
          width={100}
          height={100}
          alt="cover"
          className="w-screen h-full object-fit"
          priority
        />

        <AlertDialog>
          <AlertDialogTrigger>
            <FilterIcon className="absolute bottom-6 right-6 text-yellow-600 cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-600">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-800">
                Choose an image for cover photo.
              </AlertDialogTitle>
            </AlertDialogHeader>
            <form onSubmit={updateCoverImage}>
              <Input
                type="file"
                name="coverImage"
                className="bg-yellow-600 mb-4"
              />
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-100 text-gray-800">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-yellow-700 hover:bg-yellow-800"
                  type="submit"
                >
                  Upload
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* AVATAR PLUS DETAILS KI DIV  */}
      <div className=" row-span-7 flex flex-row justify-start items-center p-4">
        <div className="w-[40%] ">
          <div className="flex flex-col items-center justify-center gap-3">
            <Image
              src={data?.avatar || "/default.png"}
              width={100}
              height={100}
              alt="avatar"
              className=" border border-black w-48 h-48 rounded-full object-fit"
              style={{ borderRadius: "50%" }}
              priority
            />
            <AlertDialog>
              <AlertDialogTrigger>
                <div
                  className="bg-slate-900 border border-white text-white font-bold py-2 px-4 rounded cursor-pointer"
                  style={{ display: "inline-block" }}
                >
                  Edit Avatar
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-500">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-800">
                    Choose an avatar.
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={updateAvatar}>
                  <Input
                    type="file"
                    name="avatar"
                    className="bg-yellow-600 mb-4"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-100 text-gray-800">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-yellow-700 hover:bg-yellow-800"
                      type="submit"
                    >
                      Upload
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="w-[40%] ">
          <form
            onSubmit={updateDetails}
            className="flex flex-col justify-center items-center gap-3"
          >
            <h1 className="text-3xl font-bold text-center mb-4">
              User Information
            </h1>
            <div className="w-full">
              <label
                htmlFor="username"
                className="block text-gray-500 text-sm font-bold mb-2"
              >
                Username
              </label>
              <Input
                type="text"
                id="username"
                placeholder={data.username}
                disabled // This will disable the input
                className="w-full"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-gray-500 text-sm font-bold mb-2"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="fullName"
                className="block text-gray-500 text-sm font-bold mb-2"
              >
                Full Name
              </label>
              <Input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full mb-4"
              />
            </div>
            <Button type="submit">Update Details</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update;
