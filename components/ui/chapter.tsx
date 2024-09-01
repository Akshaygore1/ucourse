import React from "react";
import { formatTime } from "@/lib/utils";
import { chapterTypes } from "@/types/types";

interface ChapterProps {
  chapter: chapterTypes;
  handleSelectChapter: (chapter: chapterTypes) => void;
  isSelected: boolean;
}

function Chapter({ chapter, handleSelectChapter, isSelected }: ChapterProps) {
  const getChapterStyles = () => {
    let styles = "flex items-center gap-4 rounded-md p-3 transition-colors";

    if (!chapter.isUnlocked) {
      styles += " bg-gray-200 text-gray-500 cursor-not-allowed";
    } else if (isSelected) {
      styles += " bg-primary text-primary-foreground";
    } else if (chapter.isCompleted) {
      styles += " bg-green-100 text-green-800";
    } else {
      styles += " bg-muted hover:bg-muted-foreground/10 cursor-pointer";
    }

    return styles;
  };

  return (
    <div
      className={getChapterStyles()}
      onClick={() => chapter.isUnlocked && handleSelectChapter(chapter)}
    >
      <div className="font-semibold">{chapter.title}</div>
      <div className="ml-auto text-sm">{formatTime(chapter.time)}</div>
      {chapter.isCompleted && <span className="ml-2 text-green-600">✓</span>}
    </div>
  );
}

export default Chapter;
