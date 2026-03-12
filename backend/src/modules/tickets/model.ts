import { Schema, model } from "mongoose";
import { ITicket } from "./type";

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
      enum: ["Network", "Hardware", "Software", "Security", "Other"],
      required: true,
    },
    expectedCompletionAt: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    // L2 fields
    criticalValue: {
      type: String,
      enum: ["C1", "C2", "C3"],
      default: null,
    },
    status: {
      type: String,
      enum: ["New", "Attending", "Completed"],
      default: "New",
    },
    currentLevel: {
      type: String,
      enum: ["L1", "L2", "L3"],
      default: "L1",
    },

    // Ownership
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // assignedTo: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   default: null,
    // },

    // Escalation
    // isEscalated: {
    //   type: Boolean,
    //   default: false,
    // },
    // escalatedAt: {
    //   type: Date,
    //   default: null,
    // },

    // Closure
    // resolvedAt: {
    //   type: Date,
    //   default: null,
    // },
    // closedAt: {
    //   type: Date,
    //   default: null,
    // },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

// ─── Indexes for common query patterns ───────────────────────────────────────

TicketSchema.index({ status: 1, currentLevel: 1 });   // filtered list
TicketSchema.index({ createdBy: 1 });                  // "my tickets" view
TicketSchema.index({ assignedTo: 1 });                 // "assigned to me"
TicketSchema.index({ isEscalated: 1, criticalValue: 1 }); // L3 queue

// ─── Model ────────────────────────────────────────────────────────────────────

export const Ticket = model<ITicket>("Ticket", TicketSchema);