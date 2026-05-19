import ViewProfileButton from "./ViewProfileButton";

export type Artist = {
  id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  likes: number;
  followers: number;
};

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#C4C4C4] bg-cardBackground shadow-sm transition duration-200 hover:shadow-md">
      <div className="relative">
        <img
          src={artist.coverImage}
          alt={`${artist.name} cover`}
          className="h-40 w-full object-cover"
        />
        <div className="absolute left-1/2 top-[calc(100%-3rem)] -translate-x-1/2 rounded-full border-4 border-white bg-white">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="px-6 pb-6 pt-12 text-center">
        <h2 className="text-[22px] font-medium text-[#000000] font-['Roboto']">{artist.name}</h2>

        <div className="mt-4 flex items-center justify-center gap-6 border-t border-[#E5E5E5] pt-4 font-['Roboto']">
          <div className="min-w-[85px] text-center">
            <p className="text-[12px] font-bold text-[#434343]">{(artist.followers / 1000).toFixed(1)}K</p>
            <p className="text-[14px] font-medium text-[#666666]">Followers</p>
          </div>
          <div className="h-10 w-px bg-[#E5E5E5]" />
          <div className="min-w-[85px] text-center">
            <p className="text-[12px] font-bold text-[#434343]">{(artist.likes / 1000).toFixed(1)}K</p>
            <p className="text-[14px] font-medium text-[#666666]">Likes</p>
          </div>
        </div>

        <ViewProfileButton />
      </div>
    </article>
  );
}
