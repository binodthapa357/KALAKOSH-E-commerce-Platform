"use client";

import { useState, useRef } from "react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export default function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const allImages = images && images.length > 0 ? images : ["/placeholder.svg"];
  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center center", transform: "scale(1)" });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display with Inner Hover Zoom */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-muted border border-[#EADCC9] shadow-sm cursor-zoom-in"
      >
        <img
          src={activeImage}
          alt={name}
          style={zoomStyle}
          className="w-full h-full object-cover transition-transform duration-75 ease-out"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-300">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveImage(img);
                handleMouseLeave();
              }}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 border-2 transition-all cursor-pointer ${
                activeImage === img
                  ? "border-[#8B3232] shadow-md scale-95"
                  : "border-transparent hover:border-[#EADCC9]"
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
