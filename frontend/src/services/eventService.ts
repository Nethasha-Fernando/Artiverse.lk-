import { apiJson, getAuthHeaders, resolveMediaUrl } from "../lib/api";
import type {
  CreateEventPayload,
  EventCardItem,
  EventDetail,
  EventFilterParams,
} from "../types/event";

function normalizeCard(raw: EventCardItem): EventCardItem {
  return {
    ...raw,
    id: String(raw.id),
    coverImage: resolveMediaUrl(raw.coverImage) || raw.coverImage,
  };
}

function normalizeDetail(raw: EventDetail): EventDetail {
  return normalizeCard(raw) as EventDetail;
}

export async function fetchEvents(
  filters: EventFilterParams = {},
): Promise<EventCardItem[]> {
  const params = new URLSearchParams();
  if (filters.date) params.set("date", filters.date);
  if (filters.start) params.set("start", filters.start);
  if (filters.end) params.set("end", filters.end);
  if (filters.month) params.set("month", filters.month);
  if (filters.upcoming) params.set("upcoming", "true");

  const qs = params.toString();
  const url = qs ? `/api/events?${qs}` : "/api/events";
  const data = await apiJson<{ events: EventCardItem[] }>(url);
  return (data.events || []).map(normalizeCard);
}

export async function fetchEventById(
  id: string,
  token?: string | null,
): Promise<EventDetail> {
  const data = await apiJson<{ event: EventDetail }>(
    `/api/events/${id}`,
    { headers: getAuthHeaders(token) },
  );
  return normalizeDetail(data.event);
}

export async function fetchArtistEvents(
  artistId: string,
  token?: string | null,
): Promise<EventCardItem[]> {
  const data = await apiJson<{ events: EventCardItem[] }>(
    `/api/events/artist/${artistId}`,
    { headers: getAuthHeaders(token) },
  );
  return (data.events || []).map(normalizeCard);
}

export async function fetchAttendingEvents(
  token: string,
): Promise<EventCardItem[]> {
  const data = await apiJson<{ events: EventCardItem[] }>(
    "/api/events/user/attending",
    { headers: getAuthHeaders(token) },
  );
  return (data.events || []).map(normalizeCard);
}

export async function confirmAttendance(
  eventId: string,
  token: string,
): Promise<EventDetail> {
  const data = await apiJson<{ event: EventDetail }>(
    `/api/events/${eventId}/confirm-attendance`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
    },
  );
  return normalizeDetail(data.event);
}

export async function uploadEventCover(
  file: File,
  token: string,
): Promise<string> {
  const form = new FormData();
  form.append("coverImage", file);

  const res = await fetch("/api/events/upload-cover", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Upload failed");
  }
  return resolveMediaUrl((data as { url: string }).url);
}

export async function createEvent(
  payload: CreateEventPayload,
  token: string,
): Promise<EventCardItem> {
  const data = await apiJson<{ event: EventCardItem }>("/api/events", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return normalizeCard(data.event);
}

export async function updateEvent(
  id: string,
  payload: Partial<CreateEventPayload>,
  token: string,
): Promise<EventCardItem> {
  const data = await apiJson<{ event: EventCardItem }>(`/api/events/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return normalizeCard(data.event);
}

export async function deleteEvent(id: string, token: string): Promise<void> {
  await apiJson(`/api/events/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}
