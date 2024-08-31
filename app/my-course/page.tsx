import Mycourses from "@/components/Mycourse";

function page() {
  return (
    <div className="flex flex-col p-10">
      <h1 className="text-3xl font-bold">My Courses</h1>

      <Mycourses />
    </div>
  );
}

export default page;
