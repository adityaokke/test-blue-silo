export const TICKET_LOG_ACTION = {
  CREATED: "created",
  STATUS_CHANGED: "status_changed",
  // this escalated sould include who assigned it and to which level
  ESCALATED: "escalated",
  CRITICAL_VALUE_ASSIGNED: "critical_value_assigned",
  NOTE_ADDED: "note_added",
} as const;

export const TICKET_LOG_ACTIONS = Object.values(TICKET_LOG_ACTION);
