import React, { useMemo, useState } from "react";
import AttendingEventsSection from "../components/events/AttendingEventsSection";
import EventCard from "../components/events/EventCard";
import EventDateFilter, {
  filterStateToParams,
  type EventFilterState,
} from "../components/events/EventDateFilter";
import { useEventsList } from "../hooks/useEventsList";

const DEFAULT_FILTER: EventFilterState = {
  mode: "upcoming",
  exactDate: "",
  rangeStart: "",
  rangeEnd: "",
  month: "",
};

export default function EventsPage() {
  const [filter, setFilter] = useState<EventFilterState>(DEFAULT_FILTER);
  const params = useMemo(() => filterStateToParams(filter), [filter]);
  const state = useEventsList(params);

  return (
    <main className="min-h-screen bg-page-background px-4 py-10 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl text-center">
        <h1 className="font-heading text-center text-[48px] font-bold text-primary">
          Upcoming Events
        </h1>
        <p className="mx-auto mt-1 max-w-2xl text-center font-body text-[18px] font-medium text-text-footnote">
          Be part of our latest exhibitions and gatherings.
        </p>
      </section>

      <EventDateFilter value={filter} onChange={setFilter} />

      <AttendingEventsSection />

      {state.status === "loading" && (
        <p className="mt-10 text-center font-body text-text-footnote">
          Loading events…
        </p>
      )}

      {state.status === "error" && (
        <p className="mt-10 text-center font-body text-red-500">
          {state.message}
        </p>
      )}

      {state.status === "success" && state.data.length === 0 && (
        <p className="mt-10 text-center font-body text-text-footnote">
          No events match your filters.
        </p>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <section className="mx-auto mt-10 grid max-w-7xl grid-cols-1 place-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
          {state.data.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              highlighted={index === 1 && state.data.length >= 3}
            />
          ))}
        </section>
      )}
    </main>
  );
}
