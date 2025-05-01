"use client";
import React from "react";
import Progressbar from "@/app/_component/Progressbar";
import Chapterlist from "@/app/_component/Chapterlist";

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Chapter {
  title: string;
  time: number;
  thumbnails: Thumbnail[];
  isCompleted: boolean;
  isUnlocked: boolean;
}

export default function Chaptersidebar({
  data,
  duration,
  videoId,
}: {
  data: Chapter[];
  duration: number;
  videoId: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 px-4 py-2">
        {data && data.length > 0 && <Progressbar numOfChapters={data.length} />}
      </div>
      <div className="flex-1 overflow-y-auto">
        {data && data.length > 0 ? (
          <div className="flex flex-col gap-2">
            <Chapterlist data={data} duration={duration} videoId={videoId} />
          </div>
        ) : (
          <div className="p-4 text-white">No chapters</div>
        )}
      </div>
    </div>
  );
}
