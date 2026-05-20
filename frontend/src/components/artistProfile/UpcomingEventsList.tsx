import React from "react";
import { icons } from "../../Constants/icons";
import type { ArtistUpcomingEvent } from "../../types/artistProfile";

interface UpcomingEventsListProps {
  events: ArtistUpcomingEvent[];
}

export default function UpcomingEventsList({ events }: UpcomingEventsListProps) {
  return (
    <div className="rounded-[18px] border border-[#C4C4C4] bg-card-background px-5 py-4 shadow-card">
      <h3 className="font-heading text-sm font-medium text-text-sub-body">
        Upcoming events
      </h3>

      {events.length === 0 ? (
        <p className="mt-3 font-body text-sm text-text-footnote">
          No upcoming events scheduled.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-xl border border-[#E8E8E8] bg-page-background px-3 py-2.5"
            >
              <p className="font-heading text-sm font-medium text-text-body">
                {event.title}
              </p>
              <p className="mt-1 flex items-center gap-1.5 font-body text-xs text-text-footnote">
                <img src={icons.calendar} alt="" className="h-3 w-3 opacity-60" />
                {event.date}
              </p>
              {event.location && (
                <p className="mt-0.5 flex items-center gap-1.5 font-body text-xs text-text-footnote">
                  <img src={icons.location} alt="" className="h-3 w-3 opacity-60" />
                  {event.location}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
