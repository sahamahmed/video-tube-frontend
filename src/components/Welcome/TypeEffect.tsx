'use client'
import { useTypewriter, Cursor } from "react-simple-typewriter";

export const TypeEffect = ({className}) => {
  const [text] = useTypewriter({
    words: [
      "Join the Video Revolution.",
      "Connect Through Videos.",
      "Discover and Share Moments.",
    ],
    loop: true,
    typeSpeed: 20,
    deleteSpeed: 10,
    delaySpeed: 1500,
  });
  return (
    <p className={`text-xl md:text-4xl mt-4 lg:text-3xl share-tech-mono ${className}`}>
      {text}
      <Cursor cursorBlinking cursorStyle="|" cursorColor="#A0BED2"></Cursor>
    </p>
  );
};
