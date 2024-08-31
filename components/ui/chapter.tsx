import { formatTime } from "@/lib/utils";
import React from "react";

function Chapter({
  title,
  isCompleted,
  time,
}: {
  title: string;
  isCompleted: boolean;
  time: number;
}) {
  return (
    <div
      className={`flex items-center gap-4 ${
        !isCompleted
          ? "bg-primary-foreground text-primary"
          : "bg-muted-foreground text-muted"
      } rounded-md p-3`}
    >
      <div className="font-semibold">{title}</div>
      <div className="ml-auto text-sm ">{formatTime(time)}</div>
    </div>
  );
}

export default Chapter;
