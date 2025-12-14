import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo } from "@/lib/video-service";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const data = await getVideoInfo(url);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in getVideoinfo:", error);
    return NextResponse.json(
      { error: "Failed to fetch video info" },
      { status: 500 }
    );
  }
}
