import React from "react";

interface ProfileCoverProps {
  coverImage: string;
  artistName: string;
}

export default function ProfileCover({
  coverImage,
  artistName,
}: ProfileCoverProps) {
  return (
    <div className="relative h-[200px] w-full sm:h-[240px] lg:h-[280px]">
      <img
        src={coverImage}
        alt={`${artistName} cover`}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
