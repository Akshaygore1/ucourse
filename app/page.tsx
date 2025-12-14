"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useVideoStore } from "@/store/store";
import { CircleArrowRight, Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [url, setUrl] = useState<string | null>(null);
  const { push } = useRouter();
  const store = useVideoStore();

  const handleClick = () => {
    if (url) {
      if (url.includes("youtube.com/watch?v=")) {
        let videoId = url.split("v=")[1];
        if (videoId.includes("&")) {
          videoId = videoId.split("&")[0];
        }
        push(`/mycourse/${videoId}`);
      }
      if (url.includes("youtube.com/playlist?list=")) {
        const playlistId = url.split("list=")[1].split("&")[0];
        push(`/playlist/${playlistId}`);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-black">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Youtube className="text-destructive" size={32} />
          <span className="text-xl font-bold text-foreground">YouCourse</span>
        </div>
        <Button onClick={() => push("/mycourse")} variant="secondary">
          My Courses
        </Button>
      </nav>

      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Transform YouTube into
            <span className="text-destructive"> Structured Learning</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12">
            Convert any YouTube video or playlist into an organized course with
            chapters, progress tracking, and more.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Paste YouTube video or playlist URL"
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-4 rounded-lg bg-secondary text-secondary-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-destructive"
            />
            <Button
              onClick={handleClick}
              size="lg"
              variant="default"
              className="h-auto py-4 text-base"
            >
              Convert to Course
              <CircleArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
