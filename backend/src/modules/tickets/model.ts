import { Schema, model } from "mongoose";
import { ITicket } from "./type";
import { CATEGORIES, CRITICAL_VALUES, LEVELS, PRIORITIES, STATUSES } from "./constants";

const TicketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORIES.map((c) => c.code),
      required: true,
    },
    expectedCompletionAt: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      required: true,
    },
    currentLevel: {
      type: String,
      enum: LEVELS,
      default: "L1",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "New",
    },
    // L2 fields
    criticalValue: {
      type: String,
      enum: CRITICAL_VALUES,
      default: null,
    },
    // Ownership
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Closure
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  },
);

// ─── Indexes for common query patterns ───────────────────────────────────────

TicketSchema.index({ status: 1, currentLevel: 1 }); // filtered list
TicketSchema.index({ createdBy: 1 }); // "my tickets" view
TicketSchema.index({ assignedTo: 1 }); // "assigned to me"
TicketSchema.index({ currentLevel: 1, criticalValue: 1 }); // L3 queue

TicketSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    (ret as any)._id = undefined;
    return ret;
  },
});

TicketSchema.set("toObject", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    (ret as any)._id = undefined;
    return ret;
  },
});

// ─── Model ────────────────────────────────────────────────────────────────────

export const Ticket = model<ITicket>("Ticket", TicketSchema);
