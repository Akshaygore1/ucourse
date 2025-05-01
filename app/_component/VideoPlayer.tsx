"use client";
import React, { useEffect, useState, useRef } from "react";
import { useVideoStore } from "../../store/store";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  Volume2,
  Volume,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { Chapter } from "@/types";

interface VideoPlayerProps {
  selectedVideo: {
    id: string;
    timeStamp: number;
    maxTime: number;
    isLast: boolean;
  };
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function VideoPlayer() {
  const {
    selectedVideo,
    setSelectedVideo,
    completedVideos,
    setCompletedVideos,
  } = useVideoStore();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [key, setKey] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (selectedVideo) {
      const { id, timeStamp, maxTime } = selectedVideo;
      const url = `https://www.youtube.com/watch?v=${id}`;
      setVideoUrl(url);
      setKey((prevKey) => prevKey + 1);
      setCountdown(maxTime - timeStamp);

      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.seekTo(timeStamp, "seconds");
        }
      }, 100);
    }
  }, [selectedVideo]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (playing && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [playing, countdown]);

  const handleReady = () => {
    if (selectedVideo && playerRef.current) {
      playerRef.current.seekTo(selectedVideo.timeStamp, "seconds");
    }
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    setPlayed(playedSeconds);
    if (playedSeconds < minTime) {
      playerRef.current?.seekTo(minTime, "seconds");
    }
    if (maxTime !== null && playedSeconds > maxTime) {
      playerRef.current?.seekTo(maxTime, "seconds");
      setPlaying(false);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    if (selectedVideo) {
      setMinTime(selectedVideo.timeStamp);
      setMaxTime(selectedVideo.maxTime);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    setPlayed(seekTo);
    playerRef.current?.seekTo(seekTo, "seconds");
    if (selectedVideo) {
      setCountdown(selectedVideo.maxTime - seekTo);
    }
  };

  const handleFullScreen = () => {
    if (videoContainerRef.current) {
      if (!isFullScreen) {
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen();
        } else if ((videoContainerRef.current as any).mozRequestFullScreen) {
          (videoContainerRef.current as any).mozRequestFullScreen();
        } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
          (videoContainerRef.current as any).webkitRequestFullscreen();
        } else if ((videoContainerRef.current as any).msRequestFullscreen) {
          (videoContainerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handleMarkAsCompleted = () => {
    if (!selectedVideo) return;
    const data = localStorage.getItem(`video-${selectedVideo.id}`);
    let localObjData: {
      chapters: Chapter[];
      completed: number;
      index: number;
    } = data
      ? JSON.parse(data)
      : { chapters: [], completed: 0, index: selectedVideo.index };

    if (
      localObjData.chapters.length > 0 &&
      selectedVideo.index + 1 < localObjData.chapters.length
    ) {
      if (localObjData.chapters[selectedVideo.index]) {
        // Mark the chapter as completed
        localObjData.chapters[selectedVideo.index] = {
          ...localObjData.chapters[selectedVideo.index],
          isCompleted: true,
          isUnlocked: true,
        };

        localObjData.chapters[selectedVideo.index + 1] = {
          ...localObjData.chapters[selectedVideo.index + 1],
          isCompleted: false,
          isUnlocked: true,
        };

        // Update the completed count if needed
        localObjData.completed = localObjData.chapters.reduce(
          (count, chapter) => (chapter.isCompleted ? count + 1 : count),
          0
        );

        // Save the updated data back to localStorage
        localStorage.setItem(
          `video-${selectedVideo.id}`,
          JSON.stringify(localObjData)
        );
      }
    }

    // Perform any additional actions, such as setting the video URL to null if needed
    setVideoUrl(null);
    setSelectedVideo(null);
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full p-4 ">
      {videoUrl ? (
        <div
          ref={videoContainerRef}
          className="video-container h-[85vh] w-full relative"
        >
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            key={key}
            playing={playing}
            onReady={handleReady}
            onProgress={handleProgress}
            onPause={handlePause}
            onPlay={handlePlay}
            onDuration={handleDuration}
            width="100%"
            height="100%"
            controls={false}
            pip={true}
            muted={muted}
            autoPlay={true}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex flex-col gap-2">
              {/* Progress bar */}
              <input
                type="range"
                min={minTime}
                max={maxTime ?? duration}
                value={played}
                onChange={handleSeekChange}
                className="w-full h-1 bg-gray-400 appearance-none rounded-full outline-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #faf7f7 0%, #faf7f7 ${
                    (played / (maxTime ?? duration)) * 100
                  }%, #f7fafc ${
                    (played / (maxTime ?? duration)) * 100
                  }%, #f7fafc 100%)`,
                }}
              />

              {/* Controls and time */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="hover:text-red-500 transition-colors"
                  >
                    {playing ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button
                    onClick={() => setMuted(!muted)}
                    className="hover:text-red-500 transition-colors"
                  >
                    {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <div className="text-sm">
                    {formatTime(played)} / {formatTime(maxTime ?? duration)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    {formatTime(countdown)} remaining
                  </div>
                  <button
                    onClick={handleFullScreen}
                    className="hover:text-red-500 transition-colors"
                  >
                    {isFullScreen ? (
                      <Minimize size={24} />
                    ) : (
                      <Maximize size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2 p-2 items-center bottom-4 left-4 right-4 rounded-lg">
            <div className="flex flex-1 justify-between gap-2 py-4">
              <Link href="/">
                <button className="text-white bg-red-500 p-2 rounded-lg">
                  Back To Courses
                </button>
              </Link>
              <button
                onClick={handleMarkAsCompleted}
                className="text-white bg-red-500 p-2 rounded-lg"
              >
                Mark As Completed
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 h-full w-full p-4">
          <div className="flex flex-1 justify-center items-center">
            <div className="text-white">Select a video to start</div>
          </div>
        </div>
      )}
    </div>
  );
}
