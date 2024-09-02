import Mycourses from "@/components/Mycourse";
import Link from "next/link";

function page() {
  return (
    <div className="flex flex-col p-10">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <div className="flex items-center justify-center">
          <Link href="/">
            <button className="bg-primary text-primary-foreground p-2 rounded-md">
              Back To Landing
            </button>
          </Link>
        </div>
      </div>
      <Mycourses />
    </div>
  );
}

export default page;
