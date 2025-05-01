"use client";

import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useVideoStore } from "../store/store";
import { CircleArrowRight } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState<string | null>(null);
  const { push } = useRouter();
  const store = useVideoStore();

  const handleClick = () => {
    if (url) {
      if (url.includes("youtube.com/watch?v=")) {
        let videoId = url.split("v=")[1];
        if (videoId.includes("&")) {
          videoId = videoId.split("&")[0];
        }
        push(`/mycourse/${videoId}`);
      }
      if (url.includes("youtube.com/playlist?list=")) {
        const playlistId = url.split("list=")[1].split("&")[0];
        // const playlistId = url.split("list=")[1];
        push(`/playlist/${playlistId}`);
      }
    }
  };

  return (
    <main className="relative h-screen w-screen bg-black">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => push("/mycourse")}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
        >
          My Courses
        </button>
      </div>
      <div className="flex justify-center items-center flex-col h-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_400px_at_50%_200px,#fbfbfb36,#000)]"></div>
        <h2 className="relative z-10 text-center text-4xl font-semibold text-gray-50 sm:text-6xl mb-4">
          Welcome to
          <span className="text-red-600"> Youcourse</span>
        </h2>
        <div className="relative z-10 text-2xl inline-flex bg-gradient-to-r  bg-[200%_auto] bg-clip-text leading-tight text-transparent from-neutral-100 via-slate-400 to-neutral-400 animate-text-gradient">
          Transform YouTube Videos into Structured Courses
        </div>
        <div className="relative z-10 mt-8 w-full max-w-md px-4">
          <input
            type="text"
            placeholder="Enter YouTube Video Url Or Playlist Url"
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative z-10 mt-4">
          <button
            onClick={handleClick}
            className="px-6 py-3 gap-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 flex flex-row justify-center items-center"
          >
            Convert to Course
            <span>
              <CircleArrowRight />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
