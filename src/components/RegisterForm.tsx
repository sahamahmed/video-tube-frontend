'use client'
import React, { useEffect } from 'react'
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useFormState } from "react-dom";
import { register } from "../lib/action";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const RegisterForm = () => {
      const [state, formAction] = useFormState(register, undefined);
  const router = useRouter()
      useEffect(()=>{
        if(state?.data?._id){
          alert(`${state?.message}`)
          router.push('/login')
        }
      }, [state, router])

  return (
    <div
      className="flex flex-col justify-center items-center gap-4 gap-y-6 px-16 py-8 rounded-sm mb-4 floating-effect"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
      }}
    >
      <h2 className="text-4xl font-bold text-white mb-2">Register</h2>
      <form action={formAction} className="flex flex-col gap-4 my-8">
        <p className="text-red-500 font-semibold text-center">{state?.error}</p>
        <div className=" grid grid-cols-2 grid-rows-3 gap-4">
          <div>
            <label htmlFor="fullName" className="text-white">
              Full Name<span className="text-red-500"> *</span>
            </label>
            <Input
              type="text"
              placeholder="Full Name"
              name="fullName"
              id="fullName"
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="username" className="text-white">
              Username<span className="text-red-500"> *</span>
            </label>
            <Input
              type="text"
              placeholder="Username"
              name="username"
              id="username"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-white">
              Email<span className="text-red-500"> *</span>
            </label>
            <Input type="email" placeholder="Email" name="email" id="email" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-white">
              Password<span className="text-red-500"> *</span>
            </label>
            <Input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="avatar" className="text-white">
              Avatar<span className="text-red-500"> *</span>
            </label>
            <Input type="file" name="avatar" id="avatar" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="coverImage" className="text-white">
              Cover Image
            </label>
            <Input type="file" name="coverImage" id="coverImage" />
          </div>
        </div>

        <Button variant="secondary" className="mt-2">
          Register
        </Button>
      </form>

      <div className="text-white mt-4">
        Already registered?{" "}
        <Link href="/login" className="text-emerald-500">
          Login here
        </Link>
      </div>
    </div>
  );
}

export default RegisterForm