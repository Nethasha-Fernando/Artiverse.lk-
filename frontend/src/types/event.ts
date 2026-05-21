export type EventStatus = "draft" | "published";

export interface EventCardItem {
  id: string;
  title: string;
  summary: string;
  coverImage: string;
  location: string;
  date: string;
  time: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  attendeesCount?: number;
  status?: EventStatus;
  createdByArtist?: string;
  artistName?: string;
}

export interface EventDetail extends EventCardItem {
  description: string;
  mapLocation: string;
  latitude: number;
  longitude: number;
  isAttending: boolean;
}

export interface EventFilterParams {
  date?: string;
  start?: string;
  end?: string;
  month?: string;
  upcoming?: boolean;
}

export interface CreateEventPayload {
  title: string;
  summary: string;
  description: string;
  coverImage: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  mapLocation: string;
  latitude: number;
  longitude: number;
  status: EventStatus;
}
