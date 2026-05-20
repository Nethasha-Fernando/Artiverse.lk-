import { useEffect, useState } from "react";
import {
  ArtistNotFoundError,
  fetchArtistProfile,
} from "../services/artistService";
import type { ArtistProfile } from "../types/artistProfile";

type ArtistProfileState =
  | { status: "loading" }
  | { status: "success"; data: ArtistProfile }
  | { status: "not-found" }
  | { status: "error"; message: string };

export function useArtistProfile(idOrSlug: string | undefined) {
  const [state, setState] = useState<ArtistProfileState>({ status: "loading" });

  useEffect(() => {
    if (!idOrSlug) {
      setState({ status: "not-found" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    fetchArtistProfile(idOrSlug)
      .then((data) => {
        if (!cancelled) {
          setState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        if (error instanceof ArtistNotFoundError) {
          setState({ status: "not-found" });
          return;
        }

        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Something went wrong while loading this profile.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [idOrSlug]);

  return state;
}
