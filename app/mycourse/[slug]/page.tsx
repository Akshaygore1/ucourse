import { getVideoInfo } from "@/lib/video-service";
import MyCourses from "@/components/Mycourses";
import { VideoData } from "@/types";

export default async function MyCoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getVideoInfo(params.slug);
  const duration = data.duration;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <MyCourses data={data} duration={duration} videoId={params.slug} />
    </div>
  );
}
