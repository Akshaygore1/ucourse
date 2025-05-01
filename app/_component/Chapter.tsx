"use client";
import { useVideoStore } from "../../store/store";
import { CirclePause, CirclePlay, Check, Lock } from "lucide-react";

interface ChapterCardProps {
  title: string;
  timeStamp: number;
  nextTimestamp: number;
  videoId: string;
  totalDuration: number;
  chapterIndex: number;
  totalChapters: number;
  index: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export default function ChapterCard({
  title,
  timeStamp,
  nextTimestamp,
  videoId,
  totalDuration,
  chapterIndex,
  totalChapters,
  index,
  isCompleted,
  isUnlocked,
}: ChapterCardProps) {
  const { selectedVideo, setSelectedVideo } = useVideoStore();

  const handleClick = () => {
    setSelectedVideo({
      id: videoId,
      timeStamp,
      maxTime: nextTimestamp || totalDuration,
      isLast: chapterIndex === totalChapters - 1,
      index,
    });
  };

  return (
    <div
      className={`flex rounded-md p-3 cursor-pointer hover:bg-zinc-800 transition-colors duration-200 border ${
        isUnlocked
          ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
          : "bg-zinc-600 border-zinc-600 hover:border-zinc-500"
      }`}
      onClick={isUnlocked ? handleClick : undefined}
    >
      <div className="flex flex-col gap-1">
        <div
          className={`text-md ${isUnlocked ? "text-white" : "text-gray-400"}`}
        >
          {title}
        </div>
        <div className="text-gray-400 text-sm">
          {Math.round((nextTimestamp || totalDuration - timeStamp) / 60)} Mins
        </div>
      </div>
    </div>
  );
}
