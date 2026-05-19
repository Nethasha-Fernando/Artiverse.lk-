import React from "react";
import ViewProfileButton from "./ViewProfileButton";

export type Artist = {
  id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  likes: number;
  followers: number;
};

function formatStatCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return String(value);
}

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="w-[280px] overflow-hidden rounded-[20px] border border-[#C4C4C4] bg-card-background shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative h-[155px]">
        <img
          src={artist.coverImage}
          alt={`${artist.name} cover`}
          className="h-full w-full rounded-t-[20px] object-cover"
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="h-20 w-20 rounded-full border-[3px] border-white object-cover"
          />
        </div>
      </div>

      <div className="px-5 pb-6 pt-12 text-center font-heading">
        <h2 className="text-[20px] font-medium text-black">{artist.name}</h2>

        <div className="mt-4 flex items-center justify-center gap-5">
          <div className="min-w-[72px] text-center">
            <p className="text-[18px] font-bold text-[#434343]">
              {formatStatCount(artist.followers)}
            </p>
            <p className="text-sm font-normal text-text-sub-body">Followers</p>
          </div>
          <div className="h-[34px] w-px bg-[#D9D9D9]" aria-hidden />
          <div className="min-w-[72px] text-center">
            <p className="text-[18px] font-bold text-[#434343]">
              {formatStatCount(artist.likes)}
            </p>
            <p className="text-sm font-normal text-text-sub-body">Likes</p>
          </div>
        </div>

        <ViewProfileButton />
      </div>
    </article>
  );
}
