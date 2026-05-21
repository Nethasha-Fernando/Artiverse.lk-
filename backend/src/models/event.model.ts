import mongoose, { Document, Types } from "mongoose";

export type EventStatus = "draft" | "published";

export interface IEvent extends Document {
  title: string;
  summary: string;
  description: string;
  coverImage: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  locationName: string;
  mapLocation: string;
  latitude: number;
  longitude: number;
  createdByArtist: Types.ObjectId;
  attendees: Types.ObjectId[];
  attendeesCount: number;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },
    coverImage: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    mapLocation: {
      type: String,
      trim: true,
      default: "",
    },
    latitude: {
      type: Number,
      default: 6.9271,
    },
    longitude: {
      type: Number,
      default: 79.8612,
    },
    createdByArtist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attendeesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

eventSchema.index({ eventDate: 1, status: 1 });
eventSchema.index({ createdByArtist: 1 });

export default mongoose.model<IEvent>("Event", eventSchema);
