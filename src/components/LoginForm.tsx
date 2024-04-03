'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { login } from "@/lib/action";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login as StoreLogin } from "@/store/authSlice";

export default function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);
 const router = useRouter();
 const dispatch = useDispatch()
 
 useEffect(() => {
  console.log("state :", state)
  dispatch(StoreLogin(state))
   if (state?.user) {
    alert("logged in")
     router.push("/");
   }
 }, [state, router, dispatch]);

  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
      <form action={formAction} className="flex flex-col space-y-4">
        {state?.error}
        <Input type="email" placeholder="Email" name="email" />
        <Input type="password" placeholder="Password" name="password" />
        <Button>Login</Button>
      </form>
      {state?._id && (
        <div className="ml-8 text-2xl">
          <h1>{state.username}</h1>
          <Image src={state.avatar} width={200} height={250} alt="avatar" className="rounded-xl" />
        </div>
      )}
    </div>
  );
}
