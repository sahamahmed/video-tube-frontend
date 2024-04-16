import Image from "next/image";

function LoadMore() {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="relative w-16 h-16">
        <Image
          src="/spinner.svg"
          alt="spinner"
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
    </div>
  );
}

export default LoadMore;
