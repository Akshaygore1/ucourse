import Mycources from "@/app/_component/Mycources";
import { getVideoInfo } from "@/app/utils";
import { VideoData } from "@/types";

export default async function MyCoursePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex flex-col items-center bg-neutral-950 justify-center h-screen">
      <Mycources />
    </div>
  );
}
