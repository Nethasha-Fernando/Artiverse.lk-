import { icons } from "../../Constants/icons";
import type { ArtistProfile } from "../../types/artistProfile";
import ArtistStatsRow from "./ArtistStatsRow";
import FollowButton from "./FollowButton";

interface ProfileSidebarCardProps {
  artist: ArtistProfile;
}

export default function ProfileSidebarCard({ artist }: ProfileSidebarCardProps) {
  const location = `${artist.city}, ${artist.country}`;

  return (
    <aside className="mx-auto w-full max-w-[300px] shrink-0">
      <div className="relative -mt-16 flex justify-center sm:-mt-20">
        <img
          src={artist.profileImage}
          alt={artist.name}
          className="h-[130px] w-[130px] rounded-full border-[5px] border-white object-cover shadow-sm"
        />
      </div>

      <div className="-mt-[65px] rounded-[18px] border border-[#C4C4C4] bg-card-background px-5 pb-6 pt-[78px] text-center shadow-card">
        <div className="flex items-center justify-center gap-1.5">
          <h1 className="font-heading text-[21px] font-medium text-black">
            {artist.name}
          </h1>
          {artist.verified && (
            <img
              src={icons.verified}
              alt="Verified artist"
              className="h-4 w-4"
            />
          )}
        </div>

        <p className="mt-1 font-body text-sm font-normal text-text-body">
          {location}
        </p>

        <ArtistStatsRow
          followers={artist.followers}
          likes={artist.likes}
          artworksCount={artist.artworksCount}
        />

        <FollowButton />
      </div>
    </aside>
  );
}
