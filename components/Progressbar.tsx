"use client";

import React, { useEffect, useState } from "react";
import { useVideoStore } from "@/store/store";
import { cn } from "@/utils";

function Progressbar({ numOfChapters }: { numOfChapters: number }) {
  const [percent, setPercent] = useState(0);
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const { completedVideos, selectedVideo, videoId } = useVideoStore();

  useEffect(() => {
    const vId = selectedVideo ? selectedVideo.id : videoId;
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem(`video-${vId}`);
      let localObjData = localData ? JSON.parse(localData) : { completed: 0 };
      const completed = localObjData.completed;
      setPercent((completed / numOfChapters) * 100);
    }
  }, [completedVideos, numOfChapters, selectedVideo, videoId]);

  return (
    <div className="w-full py-4 px-1">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Progress
        </span>
        <span className="text-sm font-medium text-foreground">
          {Math.round(clampedPercent)}%
        </span>
      </div>

      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            "bg-primary"
          )}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
}

export default Progressbar;
