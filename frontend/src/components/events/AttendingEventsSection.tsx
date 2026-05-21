import React from "react";
import { Link } from "react-router-dom";
import { icons } from "../../Constants/icons";
import { useAttendingEvents } from "../../hooks/useAttendingEvents";

export default function AttendingEventsSection() {
  const state = useAttendingEvents();

  if (state.status === "idle") return null;

  return (
    <section className="mx-auto mt-14 max-w-7xl">
      <h2 className="font-heading text-[28px] font-bold text-primary">
        Events You&apos;re Attending
      </h2>
      <p className="mt-1 font-body text-[16px] text-text-footnote">
        Your confirmed exhibitions and gatherings.
      </p>

      {state.status === "loading" && (
        <p className="mt-6 font-body text-text-footnote">Loading…</p>
      )}

      {state.status === "error" && (
        <p className="mt-6 font-body text-red-500">{state.message}</p>
      )}

      {state.status === "success" && state.data.length === 0 && (
        <p className="mt-6 font-body text-text-footnote">
          You haven&apos;t confirmed attendance for any events yet.
        </p>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <div className="mt-6 flex gap-5 overflow-x-auto pb-2">
          {state.data.map((event) => (
            <article
              key={event.id}
              className="flex min-w-[280px] max-w-[300px] shrink-0 overflow-hidden rounded-[18px] border border-[#C4C4C4] bg-card-background shadow-card"
            >
              <img
                src={event.coverImage}
                alt=""
                className="h-28 w-24 shrink-0 object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                <div>
                  <h3 className="truncate font-heading text-sm font-medium text-text-body">
                    {event.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 font-body text-xs text-text-footnote">
                    <img src={icons.calendar} alt="" className="h-3.5 w-3.5 opacity-60" />
                    {event.date}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 font-body text-xs text-text-footnote">
                    <img src={icons.location} alt="" className="h-3.5 w-3.5 opacity-60" />
                    {event.location}
                  </p>
                </div>
                <Link
                  to={`/events/${event.id}`}
                  className="mt-2 rounded-full border border-sec-button-stroke px-3 py-1 text-center font-body text-xs font-medium text-primary transition hover:bg-accent"
                >
                  View event
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
