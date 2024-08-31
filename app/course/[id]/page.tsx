import CoursePage from "@/components/Coursepage";
import React from "react";

function page({ params }: { params: { id: string } }) {
  return <CoursePage id={params.id} />;
}

export default page;
