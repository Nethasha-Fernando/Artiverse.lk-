import React from "react";
import { icons } from "../../Constants/icons";
import type { EventDetail } from "../../types/event";

interface EventInfoCardProps {
  event: EventDetail;
  confirming: boolean;
  onConfirm: () => void;
}

export default function EventInfoCard({
  event,
  confirming,
  onConfirm,
}: EventInfoCardProps) {
  const confirmed = event.isAttending;

  return (
    <aside className="w-full max-w-[360px] rounded-[20px] border border-white/30 bg-white/75 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-md lg:-mt-24">
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <img src={icons.location} alt="" className="mt-0.5 h-5 w-5 opacity-70" />
          <div>
            <p className="font-body text-xs text-text-footnote">Location</p>
            <p className="font-heading text-sm font-medium text-text-body">
              {event.location}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <img src={icons.calendar} alt="" className="mt-0.5 h-5 w-5 opacity-70" />
          <div>
            <p className="font-body text-xs text-text-footnote">Date</p>
            <p className="font-heading text-sm font-medium text-text-body">
              {event.date}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <img src={icons.time} alt="" className="mt-0.5 h-5 w-5 opacity-70" />
          <div>
            <p className="font-body text-xs text-text-footnote">Time</p>
            <p className="font-heading text-sm font-medium text-text-body">
              {event.time}
            </p>
          </div>
        </li>
      </ul>

      <p className="mt-5 font-body text-sm text-text-footnote">
        <span className="font-medium text-text-body">
          {event.attendeesCount ?? 0}
        </span>{" "}
        attending
      </p>

      <button
        type="button"
        disabled={confirmed || confirming}
        onClick={onConfirm}
        className={`mt-5 w-full rounded-full py-3 font-body text-sm font-bold transition ${
          confirmed
            ? "cursor-default bg-[#E8F5E9] text-[#2E7D32]"
            : "bg-gradient-to-b from-[#FF5C5C] to-[#C41A1A] text-white shadow-md hover:shadow-[0_2px_10px_0_#BF4D4D] disabled:opacity-60"
        }`}
      >
        {confirming
          ? "Confirming…"
          : confirmed
            ? "Attendance Confirmed"
            : "Confirm Attendance"}
      </button>
    </aside>
  );
}
