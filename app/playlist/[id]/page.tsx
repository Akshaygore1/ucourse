import CoursePage from "@/components/Coursepage";
import PlaylistCoursePage from "@/components/Playlistpage";
import React from "react";

function page({ params }: { params: { id: string } }) {
  return <PlaylistCoursePage id={params.id} />;
}

export default page;
