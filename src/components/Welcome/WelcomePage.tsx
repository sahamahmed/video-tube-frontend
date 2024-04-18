import React from 'react'
import './WelcomePage.css'
import { TypeEffect } from './TypeEffect';
import { Button } from '../ui/button';
import Link from 'next/link';



const WelcomePage = () => {
  return (
    <main className="pt-8 flex justify-center items-center">
      <div className=" w-[50%] flex flex-col justidy-center items-center">
        <h1 className="text-slate-300 text-8xl neon-text font-bold w-fit roboto-bold flex justify-center items-center happy-monkey-regular  ">
          VIDEOTUBE
        </h1>
        <TypeEffect
          className={`text-slate-300 gradient-text font-semibold ml-2 mb-4 `}
        />
        <div className=" flex justify-center items-center gap-4 mt-12  ">
          <Link href={"/login"}>
            <Button
              variant="secondary"
              className=" glow-button bg-[#36454F] rounded-full w-28  hover:text-gray-600 hover:font-semibold py-6 text-lg font-normal"
            >
              Login
            </Button>{" "}
          </Link>

          <Link href={"/register"}>
            <Button
              variant="secondary"
              className=" glow-button transition bg-[#36454F] hover:text-gray-600 duration-500 hover:font-semibold rounded-full text-lg  w-28 py-6 font-normal"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );

  
}




export default WelcomePage