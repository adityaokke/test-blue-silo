// src/pages/tickets/TicketListPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "Low" | "Medium" | "High";
type Status = "New" | "Attending" | "Completed" | "Resolved";
type Level = "L1" | "L2" | "L3";
type CriticalValue = "C1" | "C2" | "C3";

interface Ticket {
  _id: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: Priority;
  status: Status;
  currentLevel: Level;
  criticalValue: CriticalValue | null;
  isEscalated: boolean;
  createdAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TICKETS: Ticket[] = [
  {
    _id: "1",
    ticketNumber: "TKT-20250312-001",
    title: "VPN not connecting after Windows update",
    category: "Network",
    priority: "High",
    status: "New",
    currentLevel: "L1",
    criticalValue: null,
    isEscalated: false,
    createdAt: "2025-03-12T08:00:00Z",
  },
  {
    _id: "2",
    ticketNumber: "TKT-20250312-002",
    title: "Payment confirmation email not sent",
    category: "Software",
    priority: "High",
    status: "Attending",
    currentLevel: "L2",
    criticalValue: "C2",
    isEscalated: true,
    createdAt: "2025-03-12T09:00:00Z",
  },
  {
    _id: "3",
    ticketNumber: "TKT-20250312-003",
    title: "System completely down for all users",
    category: "Hardware",
    priority: "High",
    status: "Attending",
    currentLevel: "L3",
    criticalValue: "C1",
    isEscalated: true,
    createdAt: "2025-03-12T10:00:00Z",
  },
  {
    _id: "4",
    ticketNumber: "TKT-20250312-004",
    title: "Export to CSV missing columns",
    category: "Software",
    priority: "Low",
    status: "Resolved",
    currentLevel: "L1",
    criticalValue: null,
    isEscalated: false,
    createdAt: "2025-03-11T08:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_STYLE: Record<Priority, string> = {
  High:   "text-red-400",
  Medium: "text-yellow-400",
  Low:    "text-slate-400",
};

const STATUS_STYLE: Record<Status, string> = {
  New:       "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  Attending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Resolved:  "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

const CRITICAL_STYLE: Record<CriticalValue, string> = {
  C1: "bg-red-500/10 text-red-400 border border-red-500/20",
  C2: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  C3: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ─── Component ────────────────────────────────────────────────────────────────

export default function TicketListPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [filterLevel, setFilterLevel] = useState<Level | "All">("All");

  const filtered = MOCK_TICKETS.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    const matchLevel = filterLevel === "All" || t.currentLevel === filterLevel;
    return matchSearch && matchStatus && matchLevel;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* Topbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-sky-500 flex items-center justify-center text-xs font-bold text-white">
            HD
          </div>
          <span className="text-sm font-semibold tracking-wide">
            Helpdesk
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">
            Ticket System
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            {user?.name}
            <span className="ml-2 bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">
              {user?.role?.code} - {user?.role?.name}
            </span>
          </span>
          <button
            onClick={logout}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Tickets</h1>
            <p className="text-slate-500 text-xs mt-0.5">
              {filtered.length} ticket{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          {user?.role?.code === "L1" && (
            <button
              onClick={() => navigate("/tickets/create")}
              className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + New Ticket
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="Search by title or ticket number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors w-72"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | "All")}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Attending">Attending</option>
            <option value="Completed">Completed</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as Level | "All")}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Levels</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800">
                <th className="text-left px-5 py-3">Ticket</th>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Priority</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Level</th>
                <th className="text-left px-5 py-3">Critical</th>
                <th className="text-left px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-600">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filtered.map((ticket) => (
                  <tr
                    key={ticket._id}
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                    className="border-b border-slate-800/50 hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 text-sky-400 font-mono text-xs">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-200 max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td className={`px-5 py-3 font-medium ${PRIORITY_STYLE[ticket.priority]}`}>
                      {ticket.priority}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLE[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {ticket.currentLevel}
                    </td>
                    <td className="px-5 py-3">
                      {ticket.criticalValue ? (
                        <span className={`px-2 py-0.5 rounded text-xs ${CRITICAL_STYLE[ticket.criticalValue]}`}>
                          {ticket.criticalValue}
                        </span>
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">
                      {formatDate(ticket.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}