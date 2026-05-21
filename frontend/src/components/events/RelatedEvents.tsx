import React, { useEffect, useState } from "react";
import { fetchEvents } from "../../services/eventService";
import type { EventCardItem } from "../../types/event";
import EventCard from "./EventCard";

interface RelatedEventsProps {
  currentEventId: string;
}

export default function RelatedEvents({ currentEventId }: RelatedEventsProps) {
  const [events, setEvents] = useState<EventCardItem[]>([]);

  useEffect(() => {
    fetchEvents({ upcoming: true })
      .then((list) =>
        setEvents(list.filter((e) => e.id !== currentEventId).slice(0, 3)),
      )
      .catch(() => setEvents([]));
  }, [currentEventId]);

  if (events.length === 0) return null;

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-10">
      <h2 className="font-heading text-[28px] font-bold text-primary">
        Other Events You May Like
      </h2>
      <div className="mt-8 grid grid-cols-1 place-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
