"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { convertSecondsToHours } from "@/utils";

function Card({
  title,
  duration,
  chapters,
  videoId,
}: {
  title: string;
  duration: number;
  chapters: any;
  videoId: string;
}) {
  const router = useRouter();
  return (
    <div
      className="w-full rounded-md p-4 cursor-pointer bg-card hover:bg-accent transition-colors duration-200 border border-border"
      onClick={() => {
        router.push(`/video/${videoId}`);
      }}
    >
      <h2 className="text-lg text-card-foreground mb-2 min-h-[3rem]">
        {title}
      </h2>
      <div className="flex flex-row justify-between text-muted-foreground">
        <p className="text-sm ">{convertSecondsToHours(duration)} Hours</p>
        <p className="text-sm ">{chapters.length} Chapters</p>
      </div>
    </div>
  );
}

export default Card;
