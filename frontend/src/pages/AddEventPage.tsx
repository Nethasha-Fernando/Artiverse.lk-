import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCoverUpload from "../components/events/EventCoverUpload";
import { useAuth } from "../context/AuthContext";
import { createEvent, uploadEventCover } from "../services/eventService";
import type { CreateEventPayload, EventStatus } from "../types/event";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80";

const emptyForm = {
  title: "",
  summary: "",
  description: "",
  coverImage: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  locationName: "",
  mapLocation: "",
  latitude: 6.9271,
  longitude: 79.8612,
};

export default function AddEventPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCover = async (file: File) => {
    if (!token) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadEventCover(file, token);
      setField("coverImage", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (status: EventStatus) => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!form.title.trim() || !form.summary.trim() || !form.eventDate) {
      setError("Title, summary, and event date are required.");
      return;
    }
    if (!form.startTime || !form.endTime || !form.locationName.trim()) {
      setError("Time and location are required.");
      return;
    }

    const cover = form.coverImage || DEFAULT_COVER;
    const payload: CreateEventPayload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      coverImage: cover,
      eventDate: form.eventDate,
      startTime: form.startTime,
      endTime: form.endTime,
      locationName: form.locationName.trim(),
      mapLocation: form.mapLocation.trim() || form.locationName.trim(),
      latitude: form.latitude,
      longitude: form.longitude,
      status,
    };

    setSubmitting(true);
    setError("");
    try {
      const created = await createEvent(payload, token);
      navigate(status === "published" ? `/events/${created.id}` : "/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-page-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-heading text-[32px] font-bold text-primary">
            Add Event
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => submit("draft")}
              className="rounded-full border border-sec-button-stroke px-5 py-2 font-body text-sm font-medium text-text-body transition hover:bg-accent disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                if (window.confirm("Discard all changes?")) {
                  setForm(emptyForm);
                  navigate(-1);
                }
              }}
              className="rounded-full bg-accent px-5 py-2 font-body text-sm font-medium text-primary transition hover:bg-[#FFE8E8] disabled:opacity-50"
            >
              Discard Changes
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => submit("published")}
              className="rounded-full bg-gradient-to-b from-[#FF5C5C] to-[#C41A1A] px-5 py-2 font-body text-sm font-bold text-white shadow-md hover:shadow-[0_2px_10px_0_#BF4D4D] disabled:opacity-50"
            >
              Publish Event
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 space-y-6">
          <section className="rounded-[18px] border border-[#C4C4C4] bg-card-background p-5 shadow-card">
            <p className="mb-3 font-heading text-sm font-medium text-text-sub-body">
              Event cover image
            </p>
            <EventCoverUpload
              imageUrl={form.coverImage}
              onFileSelect={handleCover}
              uploading={uploading}
            />
          </section>

          <section className="rounded-[18px] border border-[#C4C4C4] bg-card-background p-5 shadow-card space-y-4">
            <label className="block">
              <span className="font-body text-sm text-text-footnote">Event title</span>
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                maxLength={120}
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-text-footnote">Event summary</span>
              <input
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                maxLength={300}
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-text-footnote">
                Full event description
              </span>
              <textarea
                rows={6}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className="mt-1 w-full resize-y rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                maxLength={5000}
              />
            </label>
          </section>

          <section className="rounded-[18px] border border-[#C4C4C4] bg-card-background p-5 shadow-card">
            <p className="mb-3 font-heading text-sm font-medium text-text-sub-body">
              Date & time
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block sm:col-span-1">
                <span className="font-body text-sm text-text-footnote">Event date</span>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setField("eventDate", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-text-footnote">Start time</span>
                <input
                  type="time"
                  onChange={(e) => setField("startTime", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-text-footnote">End time</span>
                <input
                  type="time"
                  onChange={(e) => setField("endTime", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                />
              </label>
            </div>
            {(form.startTime || form.endTime) && (
              <p className="mt-2 font-body text-xs text-text-footnote">
                {form.startTime} – {form.endTime}
              </p>
            )}
          </section>

          <section className="rounded-[18px] border border-[#C4C4C4] bg-card-background p-5 shadow-card space-y-4">
            <p className="font-heading text-sm font-medium text-text-sub-body">
              Location
            </p>
            <label className="block">
              <span className="font-body text-sm text-text-footnote">Location name</span>
              <input
                value={form.locationName}
                onChange={(e) => setField("locationName", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-text-footnote">Map / address</span>
              <input
                value={form.mapLocation}
                onChange={(e) => setField("mapLocation", e.target.value)}
                placeholder="Full address for map preview"
                className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-body text-sm text-text-footnote">Latitude</span>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setField("latitude", Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-text-footnote">Longitude</span>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setField("longitude", Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border bg-page-background px-3 py-2 font-body text-text-body outline-none focus:border-sec-button-stroke"
                />
              </label>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
