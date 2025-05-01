"use client";
import React from "react";
import { convertSecondsToHours } from "../utils";
import { redirect, useRouter } from "next/navigation";

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
      className="w-full rounded-md p-4 cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200 border border-zinc-800"
      onClick={() => {
        router.push(`/video/${videoId}`);
      }}
    >
      <h2 className="text-lg text-zinc-100 mb-2 min-h-[3rem]">{title}</h2>
      <div className="flex flex-row justify-between text-zinc-500">
        <p className="text-sm ">{convertSecondsToHours(duration)} Hours</p>
        <p className="text-sm ">{chapters.length} Chapters</p>
      </div>
    </div>
  );
}

export default Card;
