"use client";
import React, { useState, useEffect, useRef } from "react";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMouseMove(event);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      const newValue = Math.min(
        Math.max(min, min + percentage * (max - min)),
        max
      );
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-2 bg-gray-200 rounded-full cursor-pointer"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute h-full bg-blue-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/4"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
};

export default Slider;
