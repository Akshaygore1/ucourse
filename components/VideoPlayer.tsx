"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useVideoStore } from "@/store/store";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  Volume2,
  Volume1,
  VolumeX,
  RotateCcw,
  RotateCw,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { Chapter } from "@/types";
import { Button } from "./ui/Button";

interface VideoPlayerProps {
  selectedVideo: {
    id: string;
    timeStamp: number;
    maxTime: number;
    isLast: boolean;
  };
}

export function formatTime(time: number) {
  if (isNaN(time)) return "00:00";
  const date = new Date(time * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm.toString().padStart(2, "0")}:${ss}`;
}

export default function VideoPlayer() {
  const { selectedVideo, setSelectedVideo } = useVideoStore();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player State
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  // playedSeconds is absolute time in the video
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0); // Total video duration
  const [seeking, setSeeking] = useState(false);
  const [buffer, setBuffer] = useState(false);

  // UI State
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Derived State helpers
  const minTime = selectedVideo?.timeStamp || 0;
  const maxTime = selectedVideo?.maxTime || duration;
  // If maxTime is provided and valid, use it to calculate segment duration; otherwise use total duration
  const segmentDuration =
    selectedVideo?.maxTime && selectedVideo.maxTime > minTime
      ? selectedVideo.maxTime - minTime
      : duration - minTime;

  // Current relative time for display (0-based)
  const relativePlayedSeconds = Math.max(0, playedSeconds - minTime);
  // Relative progress 0-1 for slider
  const relativePlayedFraction =
    segmentDuration > 0 ? relativePlayedSeconds / segmentDuration : 0;

  // Setup video when selected
  useEffect(() => {
    if (selectedVideo) {
      const { id, timeStamp, maxTime } = selectedVideo;
      const url = `https://www.youtube.com/watch?v=${id}`;
      setVideoUrl(url);
      setCountdown(Math.max(0, maxTime - timeStamp));
      setPlaying(true);
      setPlayedSeconds(timeStamp);

      // Delay seek to ensure player is ready
      setTimeout(() => {
        playerRef.current?.seekTo(timeStamp, "seconds");
      }, 500);
    }
  }, [selectedVideo]);

  // Countdown timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (playing && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playing, countdown]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedVideo || !videoUrl) return;

      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case "f":
          e.preventDefault();
          handleFullScreen();
          break;
        case "m":
          e.preventDefault();
          setMuted((m) => !m);
          break;
        case "j": // Skip back 10s
          e.preventDefault();
          handleSkip(-10);
          break;
        case "l": // Skip forward 10s
          e.preventDefault();
          handleSkip(10);
          break;
        case "arrowleft":
          e.preventDefault();
          handleSkip(-5);
          break;
        case "arrowright":
          e.preventDefault();
          handleSkip(5);
          break;
        case "arrowup":
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedVideo, videoUrl]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const handleSkip = (seconds: number) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    // Constrain within minTime and maxTime
    const targetTime = Math.min(
      Math.max(currentTime + seconds, minTime),
      maxTime
    );
    playerRef.current.seekTo(targetTime, "seconds");
    setPlayedSeconds(targetTime);
  };

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    if (!seeking) {
      setPlayedSeconds(state.playedSeconds);

      // Enforce bounds
      if (state.playedSeconds < minTime) {
        playerRef.current?.seekTo(minTime, "seconds");
      }

      if (maxTime !== null && maxTime > 0 && state.playedSeconds > maxTime) {
        // Auto-pause/complete when reaching end of segment
        setPlaying(false);
        handleMarkAsCompleted();
      }
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fraction = parseFloat(e.target.value);
    // fraction is 0-1 of the *segment*
    const newAbsoluteTime = minTime + fraction * segmentDuration;
    setPlayedSeconds(newAbsoluteTime);
  };

  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>
  ) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(playedSeconds, "seconds");
      if (maxTime) {
        setCountdown(Math.max(0, maxTime - playedSeconds));
      }
    }
  };

  const handleFullScreen = () => {
    const container = videoContainerRef.current as any;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) container.requestFullscreen();
      else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
      else if (container.webkitRequestFullscreen)
        container.webkitRequestFullscreen();
      else if (container.msRequestFullscreen) container.msRequestFullscreen();
      setIsFullScreen(true);
    } else {
      const doc = document as any;
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleMarkAsCompleted = () => {
    if (!selectedVideo) return;
    const data = localStorage.getItem(`video-${selectedVideo.id}`);

    // Default structure if not found
    // We cast selectedVideo to any because the index property might be implicit in usage
    const sv = selectedVideo as any;

    let localObjData = data
      ? JSON.parse(data)
      : { chapters: [], completed: 0, index: sv.index || 0 };

    // Update chapter completion status
    if (
      localObjData.chapters.length > 0 &&
      sv.index !== undefined &&
      localObjData.chapters[sv.index]
    ) {
      localObjData.chapters[sv.index] = {
        ...localObjData.chapters[sv.index],
        isCompleted: true,
        isUnlocked: true,
      };

      // Unlock next chapter if available
      if (localObjData.chapters[sv.index + 1]) {
        localObjData.chapters[sv.index + 1] = {
          ...localObjData.chapters[sv.index + 1],
          isCompleted: false,
          isUnlocked: true,
        };
      }

      // Recalculate completed count
      localObjData.completed = localObjData.chapters.reduce(
        (count: number, chapter: Chapter) =>
          chapter.isCompleted ? count + 1 : count,
        0
      );

      localStorage.setItem(
        `video-${selectedVideo.id}`,
        JSON.stringify(localObjData)
      );
    }

    setVideoUrl(null);
    setSelectedVideo(null);
  };

  if (!videoUrl) {
    return (
      <div className="flex flex-col gap-2 h-full w-full p-4 items-center justify-center bg-card rounded-xl border border-border">
        <div className="text-muted-foreground font-medium">
          Select a video to start learning
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 h-full w-full p-4 justify-center"
      suppressHydrationWarning
    >
      <div
        ref={videoContainerRef}
        className="group relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => playing && setShowControls(false)}
      >
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onBuffer={() => setBuffer(true)}
          onBufferEnd={() => setBuffer(false)}
          onEnded={() => {
            setPlaying(false);
            handleMarkAsCompleted();
          }}
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        {/* Click Overlay (Play/Pause) */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
          onClick={() => setPlaying(!playing)}
        >
          {/* Buffering Indicator */}
          {buffer && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          )}

          {/* Play/Pause Animation or Icon on State Change often nice, but keeping clean for now */}
          {!playing && !buffer && (
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-full border border-white/10 hover:scale-110 transition-transform">
              <Play size={32} className="text-white fill-white" />
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-20 transition-opacity duration-300 ${
            showControls || !playing ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar Container */}
          <div className="group/progress w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer relative hover:h-2 transition-all">
            {/* Seekable Input */}
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={relativePlayedFraction}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              // Touch support
              onTouchStart={handleSeekMouseDown}
              onTouchEnd={handleSeekMouseUp}
              className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
            />

            {/* Visual Progress */}
            <div
              className="absolute top-0 left-0 h-full bg-destructive rounded-full transition-all group-hover/progress:bg-destructive"
              style={{ width: `${relativePlayedFraction * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-destructive rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md ring-2 ring-white" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white font-medium select-none">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPlaying(!playing)}
                variant="ghost"
                size="icon"
                className="text-white hover:text-destructive hover:bg-white/10"
              >
                {playing ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" />
                )}
              </Button>

              <div className="flex items-center gap-2 group/volume">
                <Button
                  onClick={() => setMuted(!muted)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-destructive hover:bg-white/10"
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={24} />
                  ) : volume < 0.5 ? (
                    <Volume1 size={24} />
                  ) : (
                    <Volume2 size={24} />
                  )}
                </Button>
                <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-out">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setMuted(false);
                    }}
                    className="w-20 h-1 bg-white/30 rounded-full accent-destructive cursor-pointer ml-2"
                  />
                </div>
              </div>

              <div className="text-xs md:text-sm font-mono opacity-90 ml-2">
                {formatTime(relativePlayedSeconds)} /{" "}
                {formatTime(segmentDuration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Skip Buttons (Hidden on small screens) */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  onClick={() => handleSkip(-10)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  title="-10s"
                >
                  <RotateCcw size={18} />
                </Button>
                <Button
                  onClick={() => handleSkip(10)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  title="+10s"
                >
                  <RotateCw size={18} />
                </Button>
              </div>

              {/* Speed Control */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold min-w-[3rem] justify-center"
                >
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg overflow-hidden flex flex-col min-w-[80px]">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setPlaybackRate(rate);
                          setShowSpeedMenu(false);
                        }}
                        className={`px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors ${
                          playbackRate === rate
                            ? "text-destructive font-bold"
                            : "text-popover-foreground"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleFullScreen}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-4 px-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover:bg-accent rounded-lg"
        >
          <ChevronLeft size={16} />
          Back to Courses
        </Link>

        <Button
          onClick={handleMarkAsCompleted}
          className="shadow-lg hover:shadow-default/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <CheckCircle size={18} />
          <span>Mark Completed</span>
        </Button>
      </div>
    </div>
  );
}
