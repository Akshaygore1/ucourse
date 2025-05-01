import { create } from "zustand";

interface Video {
  id: string;
  timeStamp: number;
  maxTime: number;
  isLast: boolean;
  index: number;
}

interface VideoStore {
  selectedTimestamp: number;
  maxTime: number;
  isLast: boolean;
  selectedVideo: Video | null;
  setSelectedVideo: (video: Video | null) => void;
  completedVideos: Video[];
  setCompletedVideos: (videos: Video[]) => void;
  videoId: string | null;
  setVideoId: (videoId: string) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  selectedVideo: null,
  selectedTimestamp: 0,
  maxTime: 0,
  isLast: false,
  setSelectedVideo: (video) =>
    set({
      selectedVideo: video,
    }),
  completedVideos: [],
  setCompletedVideos: (videos: Video[]) => set({ completedVideos: videos }),
  videoId: null,
  setVideoId: (videoId: string) => set({ videoId }),
}));
