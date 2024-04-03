'use client'
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { register } from "@/lib/action";
import { useRouter } from 'next/navigation';
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
    <form action={formAction} className="flex flex-col space-y-4">
        {state?.error}
      <Input
        type="text"
        placeholder="Full Name"
        name="fullName"
        
      />
      <Input
        type="email"
        placeholder="Email"
        name="email"
        
      />
      <Input
        type="text"
        placeholder="Username"
        name="username"
      />
      <Input
        type="password"
        placeholder="Password"
        name="password"
      />
      <Input
        type="file"
        name="avatar"
      />
      <Input
        type="file"
        name="coverImage"
      />
      <Button >Register</Button>
    </form>
  );
}

export default RegisterForm