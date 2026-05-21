import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAttendingEvents } from "../services/eventService";
import type { EventCardItem } from "../types/event";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: EventCardItem[] };

export function useAttendingEvents() {
  const { token } = useAuth();
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    if (!token) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    fetchAttendingEvents(token)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Failed to load",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return state;
}
