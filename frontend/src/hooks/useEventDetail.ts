import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchEventById } from "../services/eventService";
import type { EventDetail } from "../types/event";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "not-found" }
  | { status: "success"; data: EventDetail };

export function useEventDetail(eventId?: string) {
  const { token } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!eventId) {
      setState({ status: "not-found" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    fetchEventById(eventId, token)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to load event";
          if (msg.toLowerCase().includes("not found")) {
            setState({ status: "not-found" });
          } else {
            setState({ status: "error", message: msg });
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [eventId, token]);

  return state;
}
