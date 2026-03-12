export const CATEGORIES = [
  { code: "INC", name: "Incident" },
  { code: "BUG", name: "Bug" },
  { code: "MNT", name: "Maintenance" },
  { code: "OTH", name: "Other" },
] as const;

export const CRITICAL_VALUE = ["C1", "C2", "C3"] as const;

export const LEVEL = ["L1", "L2", "L3"] as const;

export const PRIORITIES = ["Low", "Medium", "High"] as const;

export const STATUS = ["New", "Attending", "Completed"] as const;