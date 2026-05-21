import { useCallback, useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { EventCardItem, EventFilterParams } from "../types/event";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: EventCardItem[] };

export function useEventsList(filters: EventFilterParams) {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const data = await fetchEvents(filters);
      setState({ status: "success", data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load events",
      });
    }
  }, [filters.date, filters.start, filters.end, filters.month, filters.upcoming]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
