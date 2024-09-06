// app/actions.ts
"use server";

import { getPlaylistInfo, getVideoInfo } from "@/lib/utils";
import { VideoData } from "@/types/types";

export async function processYouTubeUrl(
  url: string
): Promise<VideoData | null> {
  try {
    const videoId = extractVideoId(url);
    console.log("videoId", videoId);
    if (!videoId) return null;
    const data = await getVideoInfo(videoId);
    return data;
  } catch (error) {
    console.error("Error processing video:", error);
    return null;
  }
}

function extractVideoId(url: string): string | null {
  const videoMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  );
  return videoMatch ? videoMatch[1] : null;
}

export async function processYouTubePlaylistUrl(url: string) {
  try {
    const playlistId = extractPlaylistId(url);
    if (!playlistId) return null;
    const apiKEy = process.env.YOUTUBE_API_KEY || "";
    const data = await getPlaylistInfo(playlistId, apiKEy);
    console.log("DATA", JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("Error processing playlist:", error);
    return null;
  }
}

function extractPlaylistId(url: string): string | null {
  const playlistMatch = url.match(
    /(?:youtube\.com\/playlist\?list=|youtube\.com\/playlist\?list=)([^&]+)/
  );
  return playlistMatch ? playlistMatch[1] : null;
}
