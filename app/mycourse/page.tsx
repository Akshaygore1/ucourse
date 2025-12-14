import MyCourses from "@/components/Mycourses";

export default async function MyCoursePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex flex-col items-center bg-background justify-center h-screen">
      <MyCourses />
    </div>
  );
}
