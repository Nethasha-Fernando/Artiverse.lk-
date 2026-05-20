import React from "react";
import type { ArtistProfileTab } from "../../types/artistProfile";

const tabs: { id: ArtistProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "arts", label: "Arts" },
  { id: "events", label: "Events" },
];

interface ProfileSubNavProps {
  activeTab: ArtistProfileTab;
  onTabChange: (tab: ArtistProfileTab) => void;
}

export default function ProfileSubNav({
  activeTab,
  onTabChange,
}: ProfileSubNavProps) {
  return (
    <nav
      className="w-full overflow-x-auto border-b border-border"
      aria-label="Artist profile sections"
    >
      <ul className="flex min-w-[260px] gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-3 font-heading text-sm font-medium transition sm:px-6 sm:text-base ${
                  isActive
                    ? "text-primary"
                    : "text-text-sub-body hover:text-text-body"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
