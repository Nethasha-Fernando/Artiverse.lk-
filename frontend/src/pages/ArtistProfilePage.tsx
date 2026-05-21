import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AboutSection from "../components/artistProfile/AboutSection";
import ProfileArtsTab from "../components/artistProfile/ProfileArtsTab";
import ProfileAvatar from "../components/artistProfile/ProfileAvatar";
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

interface ArtistProfilePageProps {
  /** When true, loads the logged-in artist via /api/artists/me */
  ownProfile?: boolean;
}

export default function ArtistProfilePage({
  ownProfile = false,
}: ArtistProfilePageProps) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const profileKey = ownProfile ? "me" : id;
  const state = useArtistProfile(profileKey);
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
  const isOwnProfile =
    ownProfile ||
    (!!user &&
      (user.id === artist.id || (!!user.slug && user.slug === artist.slug)));

  return (
    <main className="min-h-screen bg-page-background pb-10">
      <ProfileCover coverImage={artist.coverImage} artistName={artist.name} />

      <div className="w-full px-4 sm:px-6 lg:pl-6 lg:pr-12 xl:pl-8 xl:pr-16">
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-x-10 xl:gap-x-14">
          <aside className="mx-auto w-full max-w-[260px] justify-self-start lg:mx-0">
            <ProfileAvatar
              profileImage={artist.profileImage}
              artistName={artist.name}
            />
            <ProfileSidebarCard artist={artist} isOwnProfile={isOwnProfile} />
            <ProfileSidebarInfo artist={artist} />
          </aside>

          <div className="min-w-0 lg:pt-[4.5rem]">
            <ProfileSubNav activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
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
      </div>
    </main>
  );
}
