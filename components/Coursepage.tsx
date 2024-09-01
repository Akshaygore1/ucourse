"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { chapterTypes, VideoData } from "@/types/types";
import Chapter from "./ui/chapter";
import ReactPlayer from "react-player";
import Link from "next/link";

export default function EnhancedCoursePage({ id }: { id: string }) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<chapterTypes | null>(
    null
  );
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    const video = localStorage.getItem(`video-${id}`);
    if (video) {
      setVideoData(JSON.parse(video));
    }
  }, [id]);

  const handleSelectChapter = (chapter: chapterTypes) => {
    setSelectedChapter(chapter);
    if (playerRef.current) {
      playerRef.current.seekTo(chapter.fromTime, "seconds");
      setPlaying(true);
    }
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (selectedChapter && playedSeconds >= selectedChapter.toTime) {
      setPlaying(false);
      handleCompleteLesson();
    }
  };

  const handleCompleteLesson = () => {
    if (videoData && selectedChapter) {
      const updatedChapters = videoData.chapters.chapters.map(
        (chapter, index) => {
          if (chapter.id === selectedChapter.id) {
            return { ...chapter, isCompleted: true };
          }
          if (
            index ===
            videoData.chapters.chapters.findIndex(
              (c) => c.id === selectedChapter.id
            ) +
              1
          ) {
            return { ...chapter, isUnlocked: true };
          }
          return chapter;
        }
      );

      const updatedVideoData = {
        ...videoData,
        chapters: { ...videoData.chapters, chapters: updatedChapters },
      };
      setVideoData(updatedVideoData);
      localStorage.setItem(`video-${id}`, JSON.stringify(updatedVideoData));

      const nextChapter = updatedChapters.find(
        (chapter) => !chapter.isCompleted && chapter.isUnlocked
      );
      if (nextChapter) {
        handleSelectChapter(nextChapter);
      } else {
        setSelectedChapter(null);
        setPlaying(false);
      }
    }
  };
  console.log("selectedChapter", selectedChapter);
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6 p-4 md:p-6 bg-background text-foreground">
      <div>
        <Link href={`/my-course`}>
          <Button variant="outline" size="sm" className="w-full mb-4">
            Back to My Courses
          </Button>
        </Link>
        {selectedChapter ? (
          <>
            <div className="rounded-lg overflow-hidden">
              <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube.com/watch?v=${id}`}
                playing={playing}
                controls={true}
                width="100%"
                height="70vh"
                onProgress={handleProgress}
                pip={true}
                config={{
                  youtube: {
                    playerVars: {
                      start: selectedChapter.fromTime,
                      end: selectedChapter.toTime,
                    },
                  },
                }}
              />
            </div>
            <div className="py-4 space-y-4">
              <h1 className="text-2xl font-bold">{selectedChapter.title}</h1>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleCompleteLesson}
                disabled={
                  !selectedChapter.isUnlocked || selectedChapter.isCompleted
                }
              >
                {selectedChapter.isCompleted ? "Completed" : "Complete Lesson"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl">Select a Chapter to Begin</div>
          </div>
        )}
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chapters</h2>
        </div>
        <div className="p-4 space-y-2 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {videoData?.chapters.chapters.map((chapter, index) => (
              <Chapter
                key={index}
                chapter={chapter}
                handleSelectChapter={handleSelectChapter}
                isSelected={selectedChapter?.time === chapter.time}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
