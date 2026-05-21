import { useEffect, useState } from "react";
import { fetchArtists } from "../services/artistService";
import type { ArtistListItem } from "../types/artistProfile";

type State =
  | { status: "loading" }
  | { status: "success"; data: ArtistListItem[] }
  | { status: "error"; message: string };

export function useArtistsList() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchArtists()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              err instanceof Error ? err.message : "Failed to load artists.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
