"use client";

import { Chapter, VideoData } from "@/types";
import { useEffect, useState } from "react";
import Card from "./Card";

export default function MyCourses({
  data,
  duration,
  videoId,
}: {
  data?: VideoData;
  duration?: number;
  videoId?: string;
}) {
  const [storageKeys, setStorageKeys] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const { title, chapters } = data;
      const chapterData = chapters.chapters.map(
        (chapter: Chapter, index: number, arr: Chapter[]) => {
          return {
            id: index,
            title: chapter.title,
            time: chapter.time,
            thumbnails: chapter.thumbnails,
            isCompleted: false,
            isUnlocked: false,
          };
        }
      );
      const videoData = {
        duration,
        title,
        chapters: chapterData,
        completedVideo: 0,
      };
      localStorage.setItem(`video-${videoId}`, JSON.stringify(videoData));
    }

    setStorageKeys(
      Object.keys(localStorage).filter((key) => key.startsWith("video-"))
    );
  }, [data, duration, videoId]);
  return (
    <div className="flex flex-row flex-wrap gap-2 h-auto p-2">
      {storageKeys.length > 0 ? (
        storageKeys.map((key) => {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            return (
              <Card
                title={parsedData.title}
                duration={parsedData.duration}
                chapters={parsedData.chapters}
                videoId={key.split("-")[1]}
                key={key}
              />
            );
          }
          return null;
        })
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-white-700 text-2xl">No courses found</p>
        </div>
      )}
    </div>
  );
}
