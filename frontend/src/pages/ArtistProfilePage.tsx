import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AboutSection from "../components/artistProfile/AboutSection";
import ProfileArtsTab from "../components/artistProfile/ProfileArtsTab";
import ProfileCover from "../components/artistProfile/ProfileCover";
import ProfileEventsTab from "../components/artistProfile/ProfileEventsTab";
import ProfileSidebarCard from "../components/artistProfile/ProfileSidebarCard";
import ProfileSidebarInfo from "../components/artistProfile/ProfileSidebarInfo";
import ProfileSubNav from "../components/artistProfile/ProfileSubNav";
import {
  ProfileErrorState,
  ProfileLoadingState,
  ProfileNotFoundState,
} from "../components/artistProfile/ProfilePageStates";
import { useArtistProfile } from "../hooks/useArtistProfile";
import type { ArtistProfileTab } from "../types/artistProfile";

export default function ArtistProfilePage() {
  const { id } = useParams<{ id: string }>();
  const state = useArtistProfile(id);
  const [activeTab, setActiveTab] = useState<ArtistProfileTab>("overview");

  if (state.status === "loading") {
    return <ProfileLoadingState />;
  }

  if (state.status === "not-found") {
    return <ProfileNotFoundState />;
  }

  if (state.status === "error") {
    return <ProfileErrorState message={state.message} />;
  }

  const { data: artist } = state;

  return (
    <main className="min-h-screen bg-page-background px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <ProfileCover coverImage={artist.coverImage} artistName={artist.name} />

        <ProfileSubNav activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
          <div className="mx-auto shrink-0 lg:mx-0">
            <ProfileSidebarCard artist={artist} />
            <ProfileSidebarInfo artist={artist} />
          </div>

          <div className="min-w-0 flex-1 lg:pt-2">
            {activeTab === "overview" && <AboutSection artist={artist} />}
            {activeTab === "arts" && (
              <ProfileArtsTab
                artworks={artist.artworks}
                totalCount={artist.artworksCount}
              />
            )}
            {activeTab === "events" && (
              <ProfileEventsTab events={artist.events} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
