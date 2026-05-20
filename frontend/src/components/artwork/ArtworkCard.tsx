import type { Artwork } from "./types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type ArtworkCardProps = { artwork: Artwork };

function formatLikes(n = 0) {
  if (n < 1000) return `${n}`;
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`;
  return `${Math.floor(n / 1000)}k`;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const { id, slug, imageURL, title, artistName, category, price, likes = 0 } = artwork;
  const tag = category?.trim() || "Art";
  const navigate = useNavigate();
  const to = `/artworks/${id}/${slug}`;

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);
  const [pop, setPop] = useState(false);

  const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  const handleLike = (e: React.MouseEvent) => {
    stop(e);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount(nextLiked ? count + 1 : count - 1);
    setPop(true);
    setTimeout(() => setPop(false), 300);
  };

  return (
    <div
      onClick={() => navigate(to)}
      className="cursor-pointer bg-white [border-radius:16px] border border-[rgba(196,196,196,0.5)]
                 [box-shadow:0_2px_15px_rgba(0,0,0,0.15)] overflow-hidden w-full
                 hover:shadow-[0_0_15px_rgba(214,45,45,0.75)] hover:border-[rgba(214,45,45,0.4)]
                 transition"
    >
      
      <img
        src={imageURL}
        alt={title}
        loading="lazy"
        className="block w-full h-[205px] object-cover"
      />

      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-[14px] font-medium font-['Roboto'] text-[#3F3F3F] leading-snug truncate">
            {title}
          </h3>

          <button
            type="button"
            onClick={handleLike}
            className={`flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full transition-all duration-200
              ${liked ? "bg-red-50 border border-red-200" : "border border-transparent"}
              ${pop ? "scale-125" : "scale-100"}`}
          >
            <span className="text-sm">{liked ? "❤️" : "🤍"}</span>
            <span className={`font-['Rubik'] font-normal text-[13px] transition-colors duration-200
              ${liked ? "text-red-500" : "text-[#484848]"}`}>
              {formatLikes(count)}
            </span>
          </button>
        </div>

        <p className="font-['Roboto'] font-medium text-[12px] text-[#2e2e2e] mt-0.5">
          {artistName}
        </p>
        <p className="font-['Roboto'] font-light text-[11px] text-[#888888]">
          #{tag}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={stop}
            className="w-7 h-7 flex items-center justify-center rounded-[8px]
                       border-2 border-[#FFA8A6] hover:border-transparent hover:bg-[#FFA8A6] transition text-sm"
          >
            🛒
          </button>
          <span className="text-[#272727] font-['Roboto'] text-[14px] font-medium">
            <span className="text-[10px] font-light mr-0.5">LKR</span>{price}
          </span>
        </div>
      </div>
    </div>
  );
}