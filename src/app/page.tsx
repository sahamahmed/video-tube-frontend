import React from "react";
import AllVideo from "../components/AllVideos";
import { cookies } from "next/headers";
import WelcomePage from "../components/Welcome/WelcomePage";

export default function Home() {
  const next = cookies()
    .getAll()
    .filter((cookie) => cookie.name == "accessToken");
  const Token = next[0]?.value || "";

  const isAccessTokenPresent = !!Token;
  return (
    <div>{isAccessTokenPresent ? <AllVideo /> : <WelcomePage />}</div>
  );

}
