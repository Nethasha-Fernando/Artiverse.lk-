import type { ArtistArtworkPreview } from "../../types/artistProfile";

interface ProfileArtsTabProps {
  artworks: ArtistArtworkPreview[];
  totalCount: number;
}

export default function ProfileArtsTab({
  artworks,
  totalCount,
}: ProfileArtsTabProps) {
  return (
    <section>
      <p className="font-body text-sm text-text-footnote">
        Showing {artworks.length} of {totalCount} artworks
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {artworks.map((artwork) => (
          <article
            key={artwork.id}
            className="overflow-hidden rounded-[14px] border border-[#C4C4C4] bg-card-background shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className="aspect-square w-full object-cover"
            />
            <p className="px-3 py-2.5 font-heading text-sm font-medium text-text-body">
              {artwork.title}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
