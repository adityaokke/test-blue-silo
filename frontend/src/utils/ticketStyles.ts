import type { CriticalValue, Priority, Status } from "../types/ticket";

export const STATUS_STYLE: Record<Status, string> = {
  New:       "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  Attending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

export const PRIORITY_STYLE: Record<Priority, string> = {
  High:   "text-red-400",
  Medium: "text-yellow-400",
  Low:    "text-slate-400",
};

export const CRITICAL_STYLE: Record<CriticalValue, string> = {
  C1: "bg-red-500/10 text-red-400 border border-red-500/20",
  C2: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  C3: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};