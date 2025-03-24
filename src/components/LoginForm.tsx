'use client'

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useFormState } from "react-dom";
import { login } from "../lib/action";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as StoreLogin, setToken } from "../store/authSlice";
import Cookies from "js-cookie";
import Link from "next/link";

export default function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);
 const router = useRouter();
 const dispatch = useDispatch()
 
 useEffect(() => {
  console.log("userData:", state?.user)
  console.log("accessToken:", state?.accessToken);
  dispatch(StoreLogin(state?.user))
  dispatch(setToken(state?.accessToken))

  if (state?.accessToken) {
    Cookies.set("accessToken", state.accessToken, { expires: 1 }); 
  }

   if (state?.user) {
         router.push("/");
         window.location.reload()
   }
 }, [state, router, dispatch]);

  return (
    <div
      className="flex flex-col justify-center items-center gap-4 px-16 py-8 rounded-sm floating-effect"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
      }}
    >
      <h2 className="text-4xl font-bold text-white mb-4">Login</h2>
      <form action={formAction} className="flex flex-col gap-4 ">
        <p className="text-red-500 font-semibold text-center">{state?.error}</p>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <Input type="email" placeholder="Email" name="email" id="email" />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <Input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
          />
        </div>
        <Button variant="secondary" className="mt-2">
          Login
        </Button>
      </form>
      {state?._id && (
        <div className="ml-8 text-2xl">
          <h1>{state.username}</h1>
          <Image
            src={state.avatar}
            width={200}
            height={250}
            alt="avatar"
            className="rounded-xl"
          />
        </div>
      )}
      <div className="text-white mt-4">
        New user?{" "}
        <Link href="/register" className="text-emerald-500">
          Register here
        </Link>
      </div>
    </div>
  );
}
