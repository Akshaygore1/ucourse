import Mycources from "@/app/_component/Mycources";
import { getVideoInfo } from "@/app/utils";
import { VideoData } from "@/types";

export default async function MyCoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const data: VideoData = await getVideoInfo(params.slug);
  const duration =
    data.chapters.chapters.length > 0
      ? data?.chapters?.chapters[data.chapters.chapters.length - 1]?.time
      : 0;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Mycources data={data} duration={duration} videoId={params.slug} />
    </div>
  );
}
