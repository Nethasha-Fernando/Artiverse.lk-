import React from "react";
import ArtistCard from "../components/artists/ArtistCard";
import { getArtistListItems } from "../data/artistsMock";

// Future API: GET /api/artists — map response to ArtistListItem[]

export default function ArtistsPage() {
  const artists = getArtistListItems();

  return (
    <main className="min-h-screen bg-page-background px-4 py-10 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl text-center">
        <h1 className="font-heading text-center text-[48px] font-bold text-primary">
          Our Artists
        </h1>
        <p className="mx-auto mt-1 max-w-2xl text-center font-body text-[18px] font-medium text-text-footnote">
          Meet the talents shaping our community.
        </p>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl grid-cols-1 place-items-center gap-8 md:grid-cols-2 xl:grid-cols-4">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </section>
    </main>
  );
}
