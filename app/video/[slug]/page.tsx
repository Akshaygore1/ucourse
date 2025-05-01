"use client";
import Chaptersidebar from "@/app/_component/Chaptersidebar";
import VideoPlayer from "@/app/_component/VideoPlayer";
import { getVideoInfo } from "@/app/utils";
import { useVideoStore } from "@/store/store";
import React, { useEffect, useState } from "react";

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

export default function Page({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<Chapter[]>();
  const [duration, setDuration] = useState<number>();
  const [completed, setCompleted] = useState<number>(0);
  const { setVideoId, selectedVideo } = useVideoStore();
  useEffect(() => {
    const data = localStorage.getItem(`video-${params.slug}`);

    if (data) {
      const parseData = JSON.parse(data);
      setData(parseData?.chapters);
      setDuration(parseData?.duration);
      setCompleted(parseData?.completed);
      setVideoId(params.slug);
    }
  }, [params.slug, setVideoId, selectedVideo]);
  return (
    <div className="flex flex-row gap-2 max-h-screen h-screen overflow-hidden bg-[#292929]">
      <div className="flex flex-col gap-2 w-3/4 overflow-y-auto">
        <VideoPlayer />
      </div>
      <div className="flex flex-col gap-2 w-1/4 overflow-y-auto">
        {data && data.length > 0 && duration && (
          <Chaptersidebar
            data={data}
            duration={duration}
            videoId={params.slug}
          />
        )}
      </div>
    </div>
  );
}
