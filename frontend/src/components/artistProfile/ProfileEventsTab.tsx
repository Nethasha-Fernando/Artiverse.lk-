import React from "react";
import { icons } from "../../Constants/icons";
import type { ArtistUpcomingEvent } from "../../types/artistProfile";

interface ProfileEventsTabProps {
  events: ArtistUpcomingEvent[];
}

export default function ProfileEventsTab({ events }: ProfileEventsTabProps) {
  return (
    <section>
      <h2 className="font-heading text-xl font-medium text-text-sub-body">
        All events
      </h2>
      {events.length === 0 ? (
        <p className="mt-4 font-body text-text-footnote">No events listed yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-[14px] border border-[#C4C4C4] bg-card-background px-5 py-4 shadow-card"
            >
              <p className="font-heading text-base font-medium text-text-body">
                {event.title}
              </p>
              <p className="mt-2 flex items-center gap-2 font-body text-sm text-text-footnote">
                <img src={icons.calendar} alt="" className="h-4 w-4 opacity-60" />
                {event.date}
              </p>
              {event.location && (
                <p className="mt-1 flex items-center gap-2 font-body text-sm text-text-footnote">
                  <img src={icons.location} alt="" className="h-4 w-4 opacity-60" />
                  {event.location}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
