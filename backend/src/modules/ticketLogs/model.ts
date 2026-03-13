// src/modules/ticketLogs/ticketLog.model.ts

import { Schema, model } from "mongoose";
import { ITicketLog } from "./type";
import { CRITICAL_VALUES, LEVELS, STATUSES } from "../tickets/constants";
import { TICKET_LOG_ACTIONS } from "./constants";

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
      enum: TICKET_LOG_ACTIONS,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByRole: {
      type: String,
      enum: LEVELS,
      required: true,
    },

    // Change tracking — all optional
    fromStatus: { type: String, enum: STATUSES },
    toStatus:   { type: String, enum: STATUSES },
    fromLevel:  { type: String, enum: LEVELS },
    toLevel:    { type: String, enum: LEVELS },
    criticalValue: { type: String, enum: CRITICAL_VALUES },
    note: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // logs are immutable
  }
);

TicketLogSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const TicketLog = model<ITicketLog>("TicketLog", TicketLogSchema);