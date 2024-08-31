"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { courseData, VideoData } from "@/types/types";
import { useEffect, useState } from "react";

export default function Mycourses() {
  const [data, setData] = useState<courseData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: string[] = Object.keys(localStorage).filter((key) =>
        key.startsWith("video-")
      );
      const vidData = data.map((key, index) => {
        const video: VideoData = JSON.parse(
          localStorage.getItem(key) as string
        );
        const completed = video.chapters.chapters.filter(
          (chapter) => chapter.isCompleted
        ).length;
        return {
          id: index + 1,
          videoId: video.id,
          duration: video.duration,
          title: video.title,
          chapters: video.chapters.chapters.length,
          completed,
        };
      });
      setData(vidData);
    };
    fetchData();
  }, []);
  console.log("DATA", data);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 md:p-6 bg-background text-foreground">
      {data.length > 0 &&
        data.map((course, index) => (
          <Card
            key={index}
            className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{course.title}</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>Chapters: {course.chapters}</div>
                <div>Completed: {course.completed}</div>
              </div>
              <Link href={`/course/${course.videoId}`}>
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
