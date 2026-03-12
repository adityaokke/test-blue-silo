// src/modules/ticketLogs/ticketLog.model.ts

import { Schema, model } from "mongoose";
import { ITicketLog } from "./type";

const TicketLogSchema = new Schema<ITicketLog>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,             // always queried by ticketId
    },
    action: {
      type: String,
      enum: [
        "created",
        "status_changed",
        "escalated",
        "critical_value_assigned",
        "note_added",
        "assigned",
        "resolved",
      ],
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByRole: {
      type: String,
      enum: ["L1", "L2", "L3"],
      required: true,
    },

    // Change tracking — all optional
    fromStatus: { type: String, enum: ["New", "Attending", "Completed", "Resolved"] },
    toStatus:   { type: String, enum: ["New", "Attending", "Completed", "Resolved"] },
    fromLevel:  { type: String, enum: ["L1", "L2", "L3"] },
    toLevel:    { type: String, enum: ["L1", "L2", "L3"] },
    criticalValue: { type: String, enum: ["C1", "C2", "C3"] },
    note: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // logs are immutable
  }
);

export const TicketLog = model<ITicketLog>("TicketLog", TicketLogSchema);