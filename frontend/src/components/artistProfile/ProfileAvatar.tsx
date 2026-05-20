import React from "react";

interface ProfileAvatarProps {
  profileImage: string;
  artistName: string;
}

export default function ProfileAvatar({
  profileImage,
  artistName,
}: ProfileAvatarProps) {
  return (
    <div className="relative z-10 -mt-16 flex justify-center sm:-mt-20 lg:-mt-[72px]">
      <img
        src={profileImage}
        alt={artistName}
        className="h-[130px] w-[130px] rounded-full border-[5px] border-white object-cover shadow-md"
      />
    </div>
  );
}
