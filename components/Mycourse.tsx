"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoData, PlaylistData } from "@/types/types";

interface CourseItem {
  id: string;
  title: string;
  chapters: number;
  completed: number;
  type: "video" | "playlist";
}

export default function MyCourses() {
  const [courses, setCourses] = useState<CourseItem[]>([]);

  useEffect(() => {
    const fetchCourses = () => {
      const videoKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("video-")
      );
      const playlistKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("playlist-")
      );

      const videoCourses = videoKeys.flatMap((key) => {
        try {
          const videoString = localStorage.getItem(key);
          if (!videoString) return [];

          const video: VideoData = JSON.parse(videoString);
          if (!video || !video.id || !video.title || !video.chapters) return [];

          return [
            {
              id: video.id,
              title: video.title,
              chapters: video.chapters.chapters?.length || 0,
              completed:
                video.chapters.chapters?.filter(
                  (chapter) => chapter.isCompleted
                ).length || 0,
              type: "video" as const,
            },
          ];
        } catch (error) {
          console.error(`Error parsing video data for key ${key}:`, error);
          return [];
        }
      });

      const playlistCourses = playlistKeys.flatMap((key) => {
        try {
          const playlistString = localStorage.getItem(key);
          console.log("playlistString", playlistString);
          if (!playlistString) return [];

          const playlist: PlaylistData = JSON.parse(playlistString);
          if (!playlist || !playlist.playlistDetails || !playlist.items)
            return [];
          console.log("here");
          return [
            {
              id: playlist.playlistDetails.id,
              title: playlist.playlistDetails.title,
              chapters: playlist.items.length,
              completed: playlist.items.filter((item) => item.isCompleted)
                .length,
              type: "playlist" as const,
            },
          ];
        } catch (error) {
          console.error(`Error parsing playlist data for key ${key}:`, error);
          return [];
        }
      });

      setCourses([...videoCourses, ...playlistCourses]);
    };

    fetchCourses();
  }, []);
  console.log("courses", courses);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 md:p-6 bg-background text-foreground">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <CardContent className="h-full flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{course.title}</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>Chapters: {course.chapters}</div>
              <div>Completed: {course.completed}</div>
            </div>
            <Link
              href={
                course.type === "video"
                  ? `/video/${course.id}`
                  : `/playlist/${course.id}`
              }
            >
              <Button variant="outline" size="sm" className="w-full mt-4">
                Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
