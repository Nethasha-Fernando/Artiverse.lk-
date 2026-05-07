import type { Artwork } from "./types";
import { useNavigate } from "react-router-dom";

type ArtworkCardProps = { artwork: Artwork };

function formatLikes(n = 0) {
  if (n < 1000) return `${n}`;
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`;
  return `${Math.floor(n / 1000)}k`;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const {
    id,
    slug,
    imageURL,
    title,
    artistName,
    medium,
    price,
    likes = 0,
  } = artwork;
  const navigate = useNavigate();
  const to = `/artworks/${id}/${slug}`;

  // stop click bubbling so buttons don't trigger card navigation
  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onClick={() => navigate(to)} // whole card navigates
      className="cursor-pointer bg-white [border-radius:20px] border border-[rgba(196,196,196,0.5)]
                 [box-shadow:0_2px_15px_rgba(0,0,0,0.15)] overflow-hidden w-full
                 hover:shadow-[0_0_15px_rgba(214,45,45,0.75)] hover:border-[rgba(214,45,45,0.4)]
                 hover:border-[1px] transition"
    >
      <img
        src={imageURL}
        alt={title}
        loading="lazy"
        className="block w-full h-[230px] object-cover"
      />

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-medium font-['Roboto'] text-[#3F3F3F]">
            {title}
          </h3>

          {/* Like button (doesn't navigate) */}
          <button type="button" onClick={stop} className="like-pill">
            <span className="text-[#5A5A5A]">👍</span>
            <span className="font-['Rubik'] font-normal text-[#484848] text-[16px]">
              {formatLikes(likes)}
            </span>
          </button>
        </div>

        <p className="font-['Roboto'] font-medium text-[18px] text-[#484848]">
          {artistName}
        </p>
        <p className="font-['Roboto'] font-light text-[#272727] text-[12px]">
          #{medium}
        </p>

        <div className="mt-3 flex items-center justify-between">
          {/* Add to cart (doesn't navigate) */}
          <button
            type="button"
            onClick={stop}
            className="w-8 h-8 flex items-center justify-center [border-radius:10px]
                       border-2 border-[#FFA8A6] hover:border-transparent hover:bg-[#FFA8A6] transition"
          >
            🛒
          </button>

          <span className="text-[#272727] font-['Roboto'] text-[18px] font-medium">
            <span className="text-[12px] font-light mr-1">LKR</span>
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
