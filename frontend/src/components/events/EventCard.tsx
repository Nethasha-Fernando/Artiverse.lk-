import React from "react";
import { Link } from "react-router-dom";
import { icons } from "../../Constants/icons";
import type { EventCardItem } from "../../types/event";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80";

interface EventCardProps {
  event: EventCardItem;
  highlighted?: boolean;
}

export default function EventCard({ event, highlighted = false }: EventCardProps) {
  const cover = event.coverImage || FALLBACK_COVER;

  return (
    <article
      className={`group relative flex min-h-[420px] w-full max-w-[340px] flex-col justify-end overflow-hidden rounded-[24px] shadow-card transition duration-300 ${
        highlighted
          ? "ring-2 ring-[#5B9BD5] shadow-[0_8px_32px_rgba(91,155,213,0.45)]"
          : "hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
      }`}
    >
      <img
        src={cover}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col px-6 pb-6 pt-24">
        <h3 className="font-heading text-[22px] font-bold leading-tight text-white">
          {event.title}
        </h3>
        <p className="mt-1 font-body text-sm font-medium text-white/90">
          {event.summary}
        </p>

        <ul className="mt-4 space-y-2">
          <li className="flex items-center gap-2 font-body text-sm text-white">
            <img src={icons.location} alt="" className="h-4 w-4 brightness-0 invert" />
            {event.location}
          </li>
          <li className="flex items-center gap-2 font-body text-sm text-white">
            <img src={icons.calendar} alt="" className="h-4 w-4 brightness-0 invert" />
            {event.date}
          </li>
          <li className="flex items-center gap-2 font-body text-sm text-white">
            <img src={icons.time} alt="" className="h-4 w-4 brightness-0 invert" />
            {event.time}
          </li>
        </ul>

        <Link
          to={`/events/${event.id}`}
          className="mt-5 w-full rounded-full bg-white/90 py-2.5 text-center font-body text-sm font-bold text-text-body transition hover:bg-white"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}
