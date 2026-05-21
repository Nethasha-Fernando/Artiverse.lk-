import React from "react";
import { formatStatCount } from "../../shared/utils/format";

interface ArtistStatsRowProps {
  followers: number;
  likes: number;
  artworksCount: number;
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-base font-bold text-text-main-heading sm:text-[18px]">
        {value}
      </p>
      <p className="text-xs font-normal text-text-sub-body sm:text-sm">
        {label}
      </p>
    </div>
  );
}

export default function ArtistStatsRow({
  followers,
  likes,
  artworksCount,
}: ArtistStatsRowProps) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 font-heading sm:gap-3">
      <StatBlock value={formatStatCount(followers)} label="Followers" />
      <div className="h-[34px] w-px shrink-0 bg-[#D9D9D9]" aria-hidden />
      <StatBlock value={formatStatCount(likes)} label="Likes" />
      <div className="h-[34px] w-px shrink-0 bg-[#D9D9D9]" aria-hidden />
      <StatBlock value={formatStatCount(artworksCount)} label="Artworks" />
    </div>
  );
}
