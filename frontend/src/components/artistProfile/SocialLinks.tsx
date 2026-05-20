import { icons } from "../../Constants/icons";
import type { ArtistSocialLinks } from "../../types/artistProfile";

interface SocialLinksProps {
  links: ArtistSocialLinks;
  compact?: boolean;
}

const socialPlatforms = [
  { key: "facebook" as const, icon: icons.facebook_logo, label: "Facebook" },
  { key: "instagram" as const, icon: icons.instagram_logo, label: "Instagram" },
  { key: "tiktok" as const, icon: icons.tiktok_logo, label: "TikTok" },
  { key: "youtube" as const, icon: icons.youtube_logo, label: "YouTube" },
];

export default function SocialLinks({ links, compact = false }: SocialLinksProps) {
  const available = socialPlatforms.filter(({ key }) => links[key]);

  if (available.length === 0) return null;

  return (
    <div className={compact ? "" : "mt-6"}>
      {compact && (
        <p className="mb-2 font-heading text-xs font-medium uppercase tracking-wide text-text-footnote">
          Social
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {available.map(({ key, icon, label }) => (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="opacity-70 transition hover:opacity-100"
          >
            <img src={icon} alt="" className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
