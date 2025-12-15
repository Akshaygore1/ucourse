import { VideoData } from "@/types";

function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 0;
  if (!durationStr.includes(":")) {
    const seconds = parseInt(durationStr, 10);
    return isNaN(seconds) ? 0 : seconds;
  }

  const parts = durationStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

function parseChaptersFromDescription(
  description: string
): { title: string; time: number }[] {
  const chapters: { title: string; time: number }[] = [];
  const regex = /(\d{1,2}:\d{2}(?::\d{2})?)\s+(.*)/g;
  let match;

  while ((match = regex.exec(description)) !== null) {
    const timeStr = match[1];
    let title = match[2].trim();
    if (title.startsWith("-") || title.startsWith("–")) {
      title = title.substring(1).trim();
    }

    const time = parseDurationToSeconds(timeStr);
    chapters.push({ title, time });
  }
  return chapters;
}

function extractJSONFromScript(html: string, variableName: string): any {
  // Try multiple patterns
  const patterns = [
    `var ${variableName} = `,
    `window["${variableName}"] = `,
    `window.${variableName} = `,
    `${variableName} = `,
  ];

  for (const pattern of patterns) {
    const startIndex = html.indexOf(pattern);
    if (startIndex !== -1) {
      const jsonStartIndex = startIndex + pattern.length;

      // Find the start of the JSON object (first {)
      let objectStart = jsonStartIndex;
      while (objectStart < html.length && html[objectStart] !== "{") {
        objectStart++;
      }

      if (objectStart >= html.length) continue;

      // Now find the matching closing brace by counting braces
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      let validEnd = -1;

      for (let i = objectStart; i < html.length; i++) {
        const char = html[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === "\\") {
          escapeNext = true;
          continue;
        }

        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }

        if (!inString) {
          if (char === "{") {
            braceCount++;
          } else if (char === "}") {
            braceCount--;
            if (braceCount === 0) {
              validEnd = i + 1;
              break;
            }
          }
        }
      }

      if (validEnd > objectStart) {
        let jsonString = html.substring(objectStart, validEnd);

        // Clean up the string
        jsonString = jsonString.trim();

        // Try to parse
        try {
          return JSON.parse(jsonString);
        } catch (e) {
          // If parsing fails, try to clean up common issues
          // Remove trailing semicolons and whitespace
          jsonString = jsonString.replace(/;\s*$/, "");
          try {
            return JSON.parse(jsonString);
          } catch (e2) {
            // Log for debugging but continue to next pattern
            const errorMsg = e2 instanceof Error ? e2.message : String(e2);
            console.warn(`Failed to parse ${variableName}:`, errorMsg);
            continue;
          }
        }
      }
    }
  }

  return null;
}

export async function getVideoInfo(id: string): Promise<VideoData> {
  console.log("Fetching video info for", id);
  const videoId =
    id.startsWith("http") && id.includes("v=")
      ? id.split("v=")[1].split("&")[0]
      : id;

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // Add browser-like headers to avoid bot detection
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.youtube.com/",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch YouTube page: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // Try to extract ytInitialPlayerResponse using regex as additional fallback
    let data = extractJSONFromScript(html, "ytInitialPlayerResponse");

    // If that fails, try regex-based extraction (without dotAll flag for compatibility)
    if (!data) {
      const regex = /var ytInitialPlayerResponse\s*=\s*({[\s\S]+?});/;
      const match = html.match(regex);
      if (match && match[1]) {
        try {
          data = JSON.parse(match[1]);
        } catch (e) {
          console.warn("Regex extraction failed:", e);
        }
      }
    }

    // If that fails, try ytInitialData as fallback
    if (!data) {
      console.warn("ytInitialPlayerResponse not found, trying ytInitialData");
      data = extractJSONFromScript(html, "ytInitialData");

      if (data) {
        // Extract video details from ytInitialData structure
        const videoDetails =
          data?.contents?.twoColumnWatchNextResults?.results?.results
            ?.contents?.[0]?.videoPrimaryInfoRenderer;

        if (videoDetails) {
          const title =
            videoDetails.title?.runs?.[0]?.text ||
            videoDetails.title?.simpleText ||
            "Unknown Title";

          // Try to get description from videoSecondaryInfoRenderer
          const secondaryInfo =
            data?.contents?.twoColumnWatchNextResults?.results?.results
              ?.contents?.[1]?.videoSecondaryInfoRenderer;

          const description =
            secondaryInfo?.description?.runs
              ?.map((run: any) => run.text)
              .join("") ||
            secondaryInfo?.description?.simpleText ||
            "";

          // Try to get duration from videoDetails or player
          let durationSeconds = 0;
          const playerResponse =
            data?.playerResponse?.videoDetails || data?.player?.videoDetails;

          if (playerResponse?.lengthSeconds) {
            durationSeconds = parseInt(playerResponse.lengthSeconds, 10) || 0;
          }

          const chaptersList = parseChaptersFromDescription(description);

          return {
            id: videoId,
            duration: durationSeconds,
            title: title,
            chapters: {
              areAutoGenerated: false,
              chapters: chaptersList.map((c) => ({
                title: c.title,
                time: c.time,
                thumbnails: [],
                isCompleted: false,
                isUnlocked: false,
              })),
            },
          };
        }
      }
    }

    // Original extraction method
    if (!data) {
      throw new Error(
        "Could not find ytInitialPlayerResponse or ytInitialData in the HTML. YouTube's structure may have changed."
      );
    }

    const videoDetails = data.videoDetails;
    if (!videoDetails) {
      // Log the structure for debugging
      console.error(
        "Video details not found. Available keys:",
        Object.keys(data)
      );
      console.error("Data sample:", JSON.stringify(data).substring(0, 500));
      throw new Error("Video details not found in YouTube data");
    }

    const title = videoDetails.title || "Unknown Title";
    const description =
      videoDetails.shortDescription || videoDetails.description || "";

    const durationSeconds = parseInt(videoDetails.lengthSeconds, 10) || 0;

    const chaptersList = parseChaptersFromDescription(description);

    const responseData: VideoData = {
      id: videoId,
      duration: durationSeconds,
      title: title,
      chapters: {
        areAutoGenerated: false,
        chapters: chaptersList.map((c) => ({
          title: c.title,
          time: c.time,
          thumbnails: [],
          isCompleted: false,
          isUnlocked: false,
        })),
      },
    };

    return responseData;
  } catch (error) {
    console.error("Scraping failed:", error);
    throw error;
  }
}
