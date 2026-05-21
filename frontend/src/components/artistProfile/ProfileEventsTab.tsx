import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { icons } from "../../Constants/icons";
import { useAuth } from "../../context/AuthContext";
import { fetchArtistEvents } from "../../services/eventService";
import type { EventCardItem } from "../../types/event";

interface ProfileEventsTabProps {
  artistId: string;
  isOwnProfile: boolean;
}

export default function ProfileEventsTab({
  artistId,
  isOwnProfile,
}: ProfileEventsTabProps) {
  const { token } = useAuth();
  const [events, setEvents] = useState<EventCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchArtistEvents(artistId, token)
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [artistId, token]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-medium text-text-sub-body">
          All events
        </h2>
        {isOwnProfile && (
          <Link
            to="/add-event"
            className="rounded-full bg-gradient-to-b from-[#FF5C5C] to-[#C41A1A] px-5 py-2 font-body text-sm font-bold text-white shadow-md transition hover:shadow-[0_2px_10px_0_#BF4D4D]"
          >
            + Add Event
          </Link>
        )}
      </div>

      {loading && (
        <p className="mt-4 font-body text-text-footnote">Loading events…</p>
      )}

      {!loading && events.length === 0 && (
        <p className="mt-4 font-body text-text-footnote">No events listed yet.</p>
      )}

      {!loading && events.length > 0 && (
        <ul className="mt-6 space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-[14px] border border-[#C4C4C4] bg-card-background px-5 py-4 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-heading text-base font-medium text-text-body">
                  {event.title}
                  {event.status === "draft" && (
                    <span className="ml-2 rounded-full bg-accent px-2 py-0.5 font-body text-xs text-primary">
                      Draft
                    </span>
                  )}
                </p>
                <Link
                  to={`/events/${event.id}`}
                  className="font-body text-sm font-medium text-primary hover:underline"
                >
                  View
                </Link>
              </div>
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
