"use client";
import { useVideoStore } from "@/store/store";
import { cn } from "@/utils";
import { CheckCircle, Lock, Play, Pause } from "lucide-react";

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

  // Determine if this chapter is currently active
  const isActive = selectedVideo?.index === index;

  const handleClick = () => {
    setSelectedVideo({
      id: videoId,
      timeStamp,
      maxTime: nextTimestamp || totalDuration,
      isLast: chapterIndex === totalChapters - 1,
      index,
    });
  };

  const duration = (nextTimestamp || totalDuration) - timeStamp;
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  const formattedDuration = `${
    minutes > 0 ? `${minutes} min ` : ""
  }${seconds} sec`;

  return (
    <div
      onClick={isUnlocked ? handleClick : undefined}
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ease-in-out",
        isUnlocked
          ? "cursor-pointer hover:bg-accent hover:border-accent-foreground/50"
          : "cursor-not-allowed opacity-60 bg-muted/30 border-border",
        isActive
          ? "bg-accent border-primary ring-1 ring-primary"
          : "bg-card border-border"
      )}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Status Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
            isActive
              ? "bg-primary/20 text-primary"
              : isCompleted
              ? "bg-green-500/10 text-green-400"
              : isUnlocked
              ? "bg-muted text-muted-foreground group-hover:bg-accent-foreground/5 group-hover:text-foreground"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          {isActive ? (
            <div className="flex gap-[2px]">
              {/* Simple animated bar visual or play icon */}
              <Play size={14} fill="currentColor" />
            </div>
          ) : isCompleted ? (
            <CheckCircle size={16} />
          ) : isUnlocked ? (
            <span className="text-xs font-medium font-mono">{index + 1}</span>
          ) : (
            <Lock size={14} />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3
            className={cn(
              "text-sm font-medium truncate pr-2",
              isActive
                ? "text-primary"
                : isUnlocked
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {title}
          </h3>
          <span
            className={cn(
              "text-xs font-medium",
              isActive ? "text-primary/80" : "text-muted-foreground"
            )}
          >
            {formattedDuration}
          </span>
        </div>
      </div>

      {/* Optional: Right side indicator for active state or hover */}
      {isUnlocked && !isActive && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={14} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
