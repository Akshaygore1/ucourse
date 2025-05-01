"use client";

import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useVideoStore } from "../store/store";
import { CircleArrowRight, Youtube } from "lucide-react";

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
        push(`/playlist/${playlistId}`);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Youtube className="text-red-600" size={32} />
          <span className="text-xl font-bold text-white">YouCourse</span>
        </div>
        <button
          onClick={() => push("/mycourse")}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          My Courses
        </button>
      </nav>

      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Transform YouTube into
            <span className="text-red-600"> Structured Learning</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12">
            Convert any YouTube video or playlist into an organized course with
            chapters, progress tracking, and more.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Paste YouTube video or playlist URL"
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-4 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleClick}
              className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              Convert to Course
              <CircleArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
