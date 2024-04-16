import React from 'react'
import './WelcomePage.css'
import { TypeEffect } from './TypeEffect';
import { Button } from '../ui/button';

const WelcomePage = () => {
  return (
    <main className="m-8">
      <h1 className="text-white text-6xl neon-text font-bold w-fit nunito-font">
        VIDEOTUBE
      </h1>
      <TypeEffect className={`text-slate-300 gradient-text font-semibold`} />
      <div className=' flex justify-center items-center gap-4 mt-6'>
        <Button variant='secondary' className=' glow-button rounded-full w-28 font-normal bg-slate-400'>Login</Button>
        <Button variant='secondary' className=' glow-button rounded-full w-28 font-normal bg-slate-400'>Register</Button>
      </div>
    </main>
  );

}

export default WelcomePage