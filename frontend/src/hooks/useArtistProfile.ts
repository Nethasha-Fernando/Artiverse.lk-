import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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
  const { token } = useAuth();
  const [state, setState] = useState<ArtistProfileState>({ status: "loading" });

  useEffect(() => {
    if (!idOrSlug) {
      setState({ status: "not-found" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    const authToken = idOrSlug === "me" ? token : null;

    fetchArtistProfile(idOrSlug, authToken)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ArtistNotFoundError) {
          setState({ status: "not-found" });
          return;
        }
        setState({
          status: "error",
          message:
            err instanceof Error
              ? err.message
              : "Something went wrong while loading this profile.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [idOrSlug, token]);

  return state;
}
