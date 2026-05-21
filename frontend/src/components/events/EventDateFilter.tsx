import React from "react";

export type FilterMode = "upcoming" | "exact" | "range" | "month";

export interface EventFilterState {
  mode: FilterMode;
  exactDate: string;
  rangeStart: string;
  rangeEnd: string;
  month: string;
}

interface EventDateFilterProps {
  value: EventFilterState;
  onChange: (next: EventFilterState) => void;
}

const MODES: { id: FilterMode; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "exact", label: "Exact date" },
  { id: "range", label: "Date range" },
  { id: "month", label: "Month" },
];

export function filterStateToParams(state: EventFilterState) {
  switch (state.mode) {
    case "exact":
      return state.exactDate ? { date: state.exactDate } : { upcoming: true };
    case "range":
      return {
        start: state.rangeStart || undefined,
        end: state.rangeEnd || undefined,
      };
    case "month":
      return state.month ? { month: state.month } : { upcoming: true };
    default:
      return { upcoming: true };
  }
}

export default function EventDateFilter({ value, onChange }: EventDateFilterProps) {
  return (
    <section className="mx-auto mt-8 max-w-6xl rounded-[18px] border border-[#C4C4C4] bg-card-background px-5 py-5 shadow-card sm:px-6">
      <p className="font-heading text-base font-medium text-text-sub-body">
        Filter events
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange({ ...value, mode: m.id })}
            className={`rounded-full px-4 py-1.5 font-body text-sm transition ${
              value.mode === m.id
                ? "bg-primary text-white"
                : "border border-sec-button-stroke bg-page-background text-text-body hover:bg-accent"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        {value.mode === "exact" && (
          <label className="flex flex-col gap-1 font-body text-sm text-text-footnote">
            Select date
            <input
              type="date"
              value={value.exactDate}
              onChange={(e) => onChange({ ...value, exactDate: e.target.value })}
              className="rounded-xl border border-border bg-page-background px-3 py-2 text-text-body outline-none focus:border-sec-button-stroke"
            />
          </label>
        )}

        {value.mode === "range" && (
          <>
            <label className="flex flex-col gap-1 font-body text-sm text-text-footnote">
              From
              <input
                type="date"
                value={value.rangeStart}
                onChange={(e) => onChange({ ...value, rangeStart: e.target.value })}
                className="rounded-xl border border-border bg-page-background px-3 py-2 text-text-body outline-none focus:border-sec-button-stroke"
              />
            </label>
            <label className="flex flex-col gap-1 font-body text-sm text-text-footnote">
              To
              <input
                type="date"
                value={value.rangeEnd}
                onChange={(e) => onChange({ ...value, rangeEnd: e.target.value })}
                className="rounded-xl border border-border bg-page-background px-3 py-2 text-text-body outline-none focus:border-sec-button-stroke"
              />
            </label>
          </>
        )}

        {value.mode === "month" && (
          <label className="flex flex-col gap-1 font-body text-sm text-text-footnote">
            Month
            <input
              type="month"
              value={value.month}
              onChange={(e) => onChange({ ...value, month: e.target.value })}
              className="rounded-xl border border-border bg-page-background px-3 py-2 text-text-body outline-none focus:border-sec-button-stroke"
            />
          </label>
        )}

        {value.mode === "upcoming" && (
          <p className="font-body text-sm text-text-footnote">
            Showing all upcoming published events.
          </p>
        )}
      </div>
    </section>
  );
}
