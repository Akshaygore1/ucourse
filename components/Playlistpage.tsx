"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Chapter from "./ui/chapter";
import ReactPlayer from "react-player";
import Link from "next/link";

interface PlaylistData {
  playlistDetails: {
    id: string;
    title: string;
  };
  items: Item[];
  totalResults: number;
}

interface Item {
  id: number;
  title: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export default function PlaylistCoursePage({ id }: { id: string }) {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<
    number | null
  >(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    const playlist = localStorage.getItem(`playlist-${id}`);
    if (playlist) {
      setPlaylistData(JSON.parse(playlist));
    }
  }, [id]);

  const handleSelectChapter = (index: number) => {
    setSelectedChapterIndex(index);
    setPlaying(true);
  };

  const handleCompleteLesson = () => {
    if (selectedChapterIndex !== null && playlistData) {
      const updatedItems = playlistData.items.map((item, index) => {
        if (index === selectedChapterIndex) {
          return { ...item, isCompleted: true };
        } else if (index === selectedChapterIndex + 1) {
          return { ...item, isUnlocked: true };
        }
        return item;
      });
      const updatedPlaylistData = { ...playlistData, items: updatedItems };
      setPlaylistData(updatedPlaylistData);
      localStorage.setItem(
        `playlist-${id}`,
        JSON.stringify(updatedPlaylistData)
      );

      // Move to the next chapter if it exists
      if (selectedChapterIndex < playlistData.items.length - 1) {
        setSelectedChapterIndex(selectedChapterIndex + 1);
      }
    }
  };

  const selectedChapter =
    selectedChapterIndex !== null
      ? playlistData?.items[selectedChapterIndex]
      : null;
  const videoId = selectedChapter?.id;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6 p-4 md:p-6 bg-background text-foreground">
      <div>
        <Link href="/my-course">
          <Button variant="outline" size="sm" className="w-full mb-4">
            Back to My Courses
          </Button>
        </Link>
        {selectedChapter ? (
          <>
            <div className="rounded-lg overflow-hidden">
              <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube.com/watch?v=${videoId}`}
                playing={playing}
                controls={true}
                width="100%"
                height="70vh"
                pip={true}
              />
            </div>
            <div className="py-4 space-y-4">
              <h1 className="text-2xl font-bold">{selectedChapter.title}</h1>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleCompleteLesson}
                disabled={selectedChapter.isCompleted}
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
            {playlistData?.items.map((chapter, index) => (
              <Chapter
                key={chapter.id}
                chapter={chapter}
                handleSelectChapter={() => handleSelectChapter(index)}
                isSelected={selectedChapterIndex === index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
