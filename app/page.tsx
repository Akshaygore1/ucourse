"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CircleArrowRight,
  Youtube,
  Link as LinkIcon,
  Wand2,
  GraduationCap,
  Layout,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils";

export default function Home() {
  const [url, setUrl] = useState<string | null>(null);
  const { push } = useRouter();

  const handleClick = () => {
    if (url) {
      if (url.includes("youtube.com/watch?v=")) {
        let videoId = url.split("v=")[1];
        if (videoId.includes("&")) {
          videoId = videoId.split("&")[0];
        }
        push(`/mycourse/${videoId}`);
      } else if (url.includes("youtube.com/playlist?list=")) {
        const playlistId = url.split("list=")[1].split("&")[0];
        push(`/playlist/${playlistId}`);
      } else if (url.includes("youtu.be/")) {
        let videoId = url.split("youtu.be/")[1];
        if (videoId.includes("?")) {
          videoId = videoId.split("?")[0];
        }
        push(`/mycourse/${videoId}`);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <Youtube
              className="text-primary transition-transform group-hover:scale-110"
              size={28}
            />
            <span className="text-lg font-bold tracking-tight">YouCourse</span>
          </div>
          <Button
            onClick={() => push("/mycourse")}
            variant="secondary"
            size="sm"
            className="font-medium"
          >
            My Courses
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-40"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
            Stop Watching. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Start Learning.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform chaotic YouTube playlists into structured,
            distraction-free courses. Track your progress, take notes, and
            master any subject.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-8">
            <div className="relative flex-1 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
              <input
                type="text"
                placeholder="Paste YouTube link..."
                onChange={(e) => setUrl(e.target.value)}
                className="relative w-full h-12 px-4 rounded-md bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <Button
              onClick={handleClick}
              size="lg"
              className="h-12 px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              Start Learning
              <CircleArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground/60 pt-4">
            Works with standard videos, playlists, and short links.
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layout className="w-10 h-10 text-primary" />}
              title="Distraction Free"
              description="No sidebar suggestions, no comments, no autoplay. Just you and the content."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10 text-primary" />}
              title="Progress Tracking"
              description="We automatically save where you left off. Never lose your place in a 4-hour tutorial again."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-10 h-10 text-primary" />}
              title="Structured Learning"
              description="Convert unstructured playlists into a proper course curriculum with chapter breakdowns."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg">
              From link to lesson in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-border via-primary/50 to-border -z-10"></div>

            <Step
              number="01"
              icon={<LinkIcon className="w-6 h-6" />}
              title="Copy Link"
              desc="Grab the URL of any YouTube video or playlist you want to learn from."
            />
            <Step
              number="02"
              icon={<Wand2 className="w-6 h-6" />}
              title="Convert"
              desc="Paste it into YouCourse. Our AI instantly structures it into a course."
            />
            <Step
              number="03"
              icon={<GraduationCap className="w-6 h-6" />}
              title="Master It"
              desc="Watch without distractions, track your progress, and finish what you started."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} YouCourse. Built for learners.</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors duration-300 group">
      <div className="mb-6 bg-secondary/50 w-fit p-4 rounded-xl group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  desc,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 bg-background p-6 rounded-xl border border-transparent hover:border-border/50 transition-all">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold shadow-sm ring-4 ring-background z-10">
        {icon}
      </div>
      <span className="text-xs font-mono text-primary font-bold tracking-wider uppercase">
        Step {number}
      </span>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
