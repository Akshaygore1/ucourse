/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7djstX43h3D
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { VideoData } from "@/types/types";
import { useEffect, useState } from "react";
import Chapter from "./ui/chapter";

export default function CoursePage({ id }: { id: string }) {
  const [videoData, setVideoData] = useState<VideoData>();
  useEffect(() => {
    console.log("ID", id);
    const video = localStorage.getItem(`video-${id}`);
    if (video) {
      setVideoData(JSON.parse(video));
    }
  }, [id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6 p-4 md:p-6 bg-background text-foreground">
      <div>
        <div className="rounded-lg overflow-hidden">
          <video
            className="w-full aspect-video"
            src="https://www.youtube.com/watch?v=By9wCB9IZp0"
            controls
          />
        </div>
        <div className="py-4 space-y-4">
          <h1 className="text-2xl font-bold">Course 1</h1>
          <Button variant="outline" size="sm" className="w-full">
            Complete Lesson
          </Button>
        </div>
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chapters</h2>
        </div>
        <div className="p-4 space-y-2  max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {videoData &&
              videoData.chapters.chapters.map((chapter, index) => (
                <div key={index}>
                  <Chapter
                    title={chapter.title}
                    isCompleted={chapter.isCompleted}
                    time={chapter.time}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
