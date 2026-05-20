import React from "react";
import { icons } from "../../Constants/icons";
import type { ArtistProfile } from "../../types/artistProfile";
import SocialLinks from "./SocialLinks";
import UpcomingEventsList from "./UpcomingEventsList";

interface ProfileSidebarInfoProps {
  artist: ArtistProfile;
}

export default function ProfileSidebarInfo({ artist }: ProfileSidebarInfoProps) {
  const hasLinks =
    artist.website ||
    (artist.personalLinks && artist.personalLinks.length > 0);
  const hasSocial = Object.keys(artist.socialLinks || {}).length > 0;

  return (
    <div className="mt-4 w-full space-y-4">
      {(hasLinks || hasSocial) && (
        <div className="rounded-[18px] border border-[#C4C4C4] bg-card-background px-5 py-4 shadow-card">
          {hasLinks && (
            <div>
              <p className="font-heading text-xs font-medium uppercase tracking-wide text-text-footnote">
                Links
              </p>
              <ul className="mt-2 space-y-2">
                {artist.website && (
                  <li>
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-body text-sm text-primary transition hover:underline"
                    >
                      <img src={icons.link} alt="" className="h-3.5 w-3.5 opacity-70" />
                      <span className="truncate">Website</span>
                    </a>
                  </li>
                )}
                {artist.personalLinks?.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-body text-sm text-text-body transition hover:text-primary"
                    >
                      <img src={icons.link} alt="" className="h-3.5 w-3.5 opacity-70" />
                      <span className="truncate">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasSocial && (
            <div className={`${hasLinks ? "mt-4 border-t border-[#E8E8E8] pt-4" : ""}`}>
              <SocialLinks links={artist.socialLinks} compact />
            </div>
          )}
        </div>
      )}

      <UpcomingEventsList events={artist.upcomingEvents} />
    </div>
  );
}
