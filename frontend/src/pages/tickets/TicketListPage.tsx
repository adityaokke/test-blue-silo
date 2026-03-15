import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ticketService } from "../../services/ticket";
import { useAuthStore } from "../../store/auth";
import type { ITicket, Level, Priority, Status } from "../../types/ticket";
import {
  CRITICAL_STYLE,
  PRIORITY_STYLE,
  STATUS_STYLE,
} from "../../utils/ticketStyles";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [filterStatus, setFilterStatus] = useState<Status | "All">(
    (searchParams.get("status") as Status) ?? "All",
  );
  const [filterPriority, setFilterPriority] = useState<Priority | "All">(
    (searchParams.get("priority") as Priority) ?? "All",
  );
  const [filterLevel, setFilterLevel] = useState<Level | "All">(
    (searchParams.get("level") as Level) ?? user?.role.level ?? "All",
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setSearchParams((prev) => {
      prev.set("search", val);
      return prev;
    });
  };

  const handleFilterStatus = (val: string) => {
    setFilterStatus(val as Status | "All");
    setSearchParams((prev) => {
      prev.set("status", val);
      return prev;
    });
  };

  const handleFilterPriority = (val: string) => {
    setFilterPriority(val as Priority | "All");
    setSearchParams((prev) => {
      prev.set("priority", val);
      return prev;
    });
  };

  const handleFilterLevel = (val: string) => {
    setFilterLevel(val as Level | "All");
    setSearchParams((prev) => {
      prev.set("level", val);
      return prev;
    });
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus, filterPriority, filterLevel]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchTickets(), 500);
    return () => clearTimeout(timeout); // cancel if user keeps typing
  }, [search]);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const [res] = await Promise.all([
        ticketService.getAll({
          status: filterStatus !== "All" ? filterStatus : undefined,
          priority: filterPriority !== "All" ? filterPriority : undefined,
          currentLevel: filterLevel !== "All" ? filterLevel : undefined,
          search: search || undefined,
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)), // ← minimum 1s
      ]);
      setTickets(res.data);
    } catch {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Topbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-sky-500 flex items-center justify-center text-xs font-bold text-white">
            HD
          </div>
          <span className="text-sm font-semibold tracking-wide">Helpdesk</span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">
            Ticket System
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            {user?.name}
            <span className="ml-2 bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">
              {user?.role?.level} - {user?.role?.name}
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
              {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found
            </p>
          </div>
          {user?.role?.level === "L1" && (
            <button
              onClick={() => navigate("/tickets/create")}
              className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              New Ticket
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="Search by title or ticket number..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors w-72"
          />
          <select
            value={filterStatus}
            onChange={(e) => handleFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Attending">Attending</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => handleFilterPriority(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            value={filterLevel}
            onChange={(e) => handleFilterLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="All">All Levels</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

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
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="px-5 py-4">
                        <div className="h-3 bg-slate-800 rounded animate-pulse w-36" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-3 bg-slate-800 rounded animate-pulse w-52" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-3 bg-slate-800 rounded animate-pulse w-14" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-5 bg-slate-800 rounded animate-pulse w-20" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-3 bg-slate-800 rounded animate-pulse w-8" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-5 bg-slate-800 rounded animate-pulse w-10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-3 bg-slate-800 rounded animate-pulse w-24" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-600">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="border-b border-slate-800/50 hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 text-sky-400 font-mono text-xs">
                      {ticket.id}
                    </td>
                    <td className="px-5 py-3 text-slate-200 max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td
                      className={`px-5 py-3 font-medium ${PRIORITY_STYLE[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLE[ticket.status]}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {ticket.currentLevel}
                    </td>
                    <td className="px-5 py-3">
                      {ticket.criticalValue ? (
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${CRITICAL_STYLE[ticket.criticalValue]}`}
                        >
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
