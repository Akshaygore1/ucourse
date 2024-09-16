"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaylistData, VideoData } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { processYouTubePlaylistUrl, processYouTubeUrl } from "@/actions";
import ReactPlayer from "react-player";

export function Landing() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const videoUrl = "https://www.youtube.com/watch?v=GZOTLYDNUuI";

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleClick = async () => {
    if (!url) {
      toast({
        title: "Enter YouTube URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      let data;
      let playlistData;
      if (url.includes("youtube.com/watch?v=")) {
        data = await processYouTubeUrl(url);
      } else if (url.includes("youtube.com/playlist?list=")) {
        playlistData = await processYouTubePlaylistUrl(url);
      }

      if (data) {
        saveVideoData(data);
        toast({
          title: "Video added successfully",
          description: "Check your course page to continue",
          variant: "success",
        });
      } else if (playlistData) {
        console.log("playlistData ---", playlistData);
        savePlaylistData(playlistData);
        toast({
          title: "Playlist added successfully",
          description: "Check your course page to continue",
          variant: "success",
        });
      } else {
        throw new Error("Failed to process video");
      }
    } catch (error) {
      console.error("Error processing video:", error);
      toast({
        title: "Error processing video",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveVideoData = (data: VideoData) => {
    const videoId = data.id;
    const storedData = localStorage.getItem(`video-${videoId}`);
    if (storedData) return; // Data already exists, no need to save again

    const processedChapters = data.chapters.chapters.map(
      (chapter, index, arr) => ({
        ...chapter,
        id: index + 1,
        isCompleted: false,
        isUnlocked: index === 0 || false,
        fromTime: chapter.time,
        toTime: arr[index + 1]?.time || data.duration,
      })
    );

    const dataToSave = {
      ...data,
      chapters: { ...data.chapters, chapters: processedChapters },
    };

    localStorage.setItem(`video-${videoId}`, JSON.stringify(dataToSave));
  };

  const savePlaylistData = (data: PlaylistData) => {
    const playlistId = data.playlistDetails.id;
    const storedData = localStorage.getItem(`playlist-${playlistId}`);
    if (storedData) return; // Data already exists, no need to save again

    const processedChapters = data.items.map((item, index, arr) => ({
      ...item,
      isCompleted: false,
      isUnlocked: index === 0 || false,
    }));
    const updatedData = {
      ...data,
      items: processedChapters,
    };
    localStorage.setItem(`playlist-${playlistId}`, JSON.stringify(updatedData));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="#" className="flex items-center justify-center">
          <RightAlignedTriangleIcon />
          <span className="sr-only">Youcourse</span>
        </Link>
        <Link
          href="/my-course"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          My Course
        </Link>
      </header>
      <main className="flex-1 flex items-center">
        <section className="w-full flex justify-center items-center">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock Your Learning Potential with Youcourse
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Transform YouTube Videos into Courses Instantly. Paste URL.
                    Start Learning. For Free.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Paste a YouTube URL or Playlist URL"
                      className="max-w-lg flex-1"
                      onChange={(e) => setUrl(e.target.value)}
                      value={url}
                    />
                    <Button onClick={handleClick} disabled={isLoading}>
                      {isLoading ? "Loading..." : "Go"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="aspect-video w-full relative overflow-hidden rounded-xl">
                <ReactPlayer
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1, controls: 0 },
                    },
                  }}
                />
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                    onClick={handlePlay}
                  >
                    <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md"></div>
                    <div className="relative z-30 w-20 h-20 bg-white bg-opacity-25 rounded-full flex items-center justify-center border-2 border-white">
                      <svg
                        className="w-10 h-10 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          <Link href="https://akshaygore.tech">Made By Akshay Gore</Link>
        </p>
      </footer>
    </div>
  );
}

function RightAlignedTriangleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12 L3 4 L3 20 Z" />
    </svg>
  );
}
