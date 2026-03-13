export const TICKET_LOG_ACTION = {
  CREATED:                "created",
  // STATUS_CHANGED:         "status_changed",
  // ESCALATED:              "escalated",
  // CRITICAL_VALUE_ASSIGNED: "critical_value_assigned",
  NOTE_ADDED:             "note_added",
  // ASSIGNED:               "assigned",
  // RESOLVED:               "resolved",
} as const;

export const TICKET_LOG_ACTIONS = Object.values(TICKET_LOG_ACTION);
