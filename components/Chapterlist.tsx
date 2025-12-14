"use client";
import React from "react";
import ChapterCard from "./Chapter";
import { Chapter } from "@/types";
import { cn } from "@/utils";

export default function Chapterlist({
  data,
  duration,
  videoId,
}: {
  data: Chapter[];
  duration: number;
  videoId: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 p-4 w-full")}>
      {data.map((chapter: Chapter, index: number, arr: Chapter[]) => (
        <ChapterCard
          title={chapter.title}
          videoId={videoId}
          timeStamp={chapter.time}
          key={chapter.title}
          nextTimestamp={arr[index + 1]?.time}
          totalDuration={duration}
          chapterIndex={index}
          totalChapters={arr.length}
          index={index}
          isCompleted={chapter.isCompleted || false}
          isUnlocked={index === 0 || chapter.isUnlocked || false}
        />
      ))}
    </div>
  );
}
