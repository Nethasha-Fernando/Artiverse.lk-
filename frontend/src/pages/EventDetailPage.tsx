import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EventInfoCard from "../components/events/EventInfoCard";
import RelatedEvents from "../components/events/RelatedEvents";
import { useAuth } from "../context/AuthContext";
import { useEventDetail } from "../hooks/useEventDetail";
import { confirmAttendance } from "../services/eventService";
import type { EventDetail } from "../types/event";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1600&q=80";

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const state = useEventDetail(eventId);
  const [confirming, setConfirming] = useState(false);
  const [localEvent, setLocalEvent] = useState<EventDetail | null>(null);

  const event =
    localEvent ?? (state.status === "success" ? state.data : null);

  const handleConfirm = async () => {
    if (!eventId || !token || !event || event.isAttending) return;
    setConfirming(true);
    try {
      const updated = await confirmAttendance(eventId, token);
      setLocalEvent(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not confirm attendance");
    } finally {
      setConfirming(false);
    }
  };

  if (state.status === "loading") {
    return (
      <main className="min-h-screen bg-page-background px-4 py-20 text-center font-body text-text-footnote">
        Loading event…
      </main>
    );
  }

  if (state.status === "not-found") {
    return (
      <main className="min-h-screen bg-page-background px-4 py-20 text-center">
        <p className="font-body text-text-footnote">Event not found.</p>
        <Link to="/events" className="mt-4 inline-block font-body text-primary hover:underline">
          Back to events
        </Link>
      </main>
    );
  }

  if (state.status === "error" || !event) {
    return (
      <main className="min-h-screen bg-page-background px-4 py-20 text-center font-body text-red-500">
        {state.status === "error" ? state.message : "Something went wrong."}
      </main>
    );
  }

  const cover = event.coverImage || FALLBACK_COVER;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${
    event.longitude - 0.02
  }%2C${event.latitude - 0.02}%2C${event.longitude + 0.02}%2C${
    event.latitude + 0.02
  }&layer=mapnik&marker=${event.latitude}%2C${event.longitude}`;

  return (
    <main className="min-h-screen bg-page-background pb-16">
      <section className="relative min-h-[380px] w-full sm:min-h-[420px]">
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 pt-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-12">
          <div className="max-w-2xl text-white lg:pb-8">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="mb-4 font-body text-sm text-white/80 hover:text-white"
            >
              ← Back to events
            </button>
            <h1 className="font-heading text-[40px] font-bold leading-tight sm:text-[48px]">
              {event.title}
            </h1>
            <p className="mt-3 font-body text-lg text-white/90">{event.summary}</p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <EventInfoCard
              event={event}
              confirming={confirming}
              onConfirm={() => {
                if (!token) {
                  navigate("/login");
                  return;
                }
                handleConfirm();
              }}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-10">
        <section>
          <h2 className="font-heading text-xl font-medium text-text-sub-body">
            Event Description
          </h2>
          <div className="mt-4 whitespace-pre-wrap font-body text-[15px] leading-relaxed text-text-body">
            {event.description || "Details coming soon."}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-xl font-medium text-text-sub-body">
            Event Location
          </h2>
          <p className="mt-2 font-body text-text-footnote">
            {event.mapLocation || event.location}
          </p>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-[#C4C4C4] shadow-card">
            <iframe
              title="Event location map"
              src={mapSrc}
              className="h-[280px] w-full border-0 sm:h-[320px]"
              loading="lazy"
            />
          </div>
        </section>
      </div>

      <RelatedEvents currentEventId={event.id} />
    </main>
  );
}
