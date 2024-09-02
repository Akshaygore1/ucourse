// app/actions.ts
"use server";

import { getVideoInfo } from "@/lib/utils";
import { VideoData } from "@/types/types";

export async function processYouTubeUrl(
  url: string
): Promise<VideoData | null> {
  try {
    const videoId = extractVideoId(url);
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
