import ArtistCard, { type Artist } from "../components/artists/ArtistCard";

// Future API expects a MongoDB artists collection with documents like:
// {
//   _id: string,
//   name: string,
//   profileImage: string,
//   coverImage: string,
//   likes: number,
//   followers: number,
//   createdAt: string
// }
// Planned API route: GET /api/artists

const artists: Artist[] = [
  {
    id: "1",
    name: "Melissa Peters",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=80",
    followers: 12900,
    likes: 12100,
  },
  {
    id: "2",
    name: "Noah Bennett",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    followers: 10400,
    likes: 9800,
  },
  {
    id: "3",
    name: "Ava Martinez",
    profileImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    followers: 11800,
    likes: 10900,
  },
  {
    id: "4",
    name: "Leo Carter",
    profileImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
    followers: 13200,
    likes: 12500,
  },
];

export default function ArtistsPage() {
  return (
    <main className="min-h-screen bg-pageBackground px-4 py-10 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl text-center">
        <h1 className="text-[48px] font-bold text-primary font-['Roboto']">
          Our Artists
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[18px] font-medium text-[#848484] font-['Roboto']">
          Meet the talents shaping our community.
        </p>
      </section>

      <section className="mx-auto mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </section>
    </main>
  );
}
