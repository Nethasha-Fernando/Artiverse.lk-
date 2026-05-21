import { useState, useEffect }   from "react";
import type { Artwork }          from "../shared/types/types";
import { mapArtworkFromApi }     from "../shared/utils/mapArtwork";

export function useLandingArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/artworks")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (!Array.isArray(data)) { setArtworks([]); return; }
        setArtworks(data.slice(0, 8).map(mapArtworkFromApi));
      })
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false));
  }, []);

  return { artworks, loading };
}