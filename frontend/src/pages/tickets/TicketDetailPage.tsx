import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ITicket, ITicketLog } from "../../types/ticket";
import { ticketService } from "../../services/ticket";
import {
  CRITICAL_STYLE,
  PRIORITY_STYLE,
  STATUS_STYLE,
} from "../../utils/ticketStyles";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [logs, setLogs] = useState<ITicketLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchTicket(id);
  }, [id]);

  const fetchTicket = async (ticketId: string) => {
    setLoading(true);
    setError("");
    try {
      const [ticketRes, logsRes] = await Promise.all([
        ticketService.getById(ticketId),
        ticketService.getLogs(ticketId),
      ]);
      setTicket(ticketRes.data);
      setLogs(logsRes.data);
    } catch {
      setError("Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error || "Ticket not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Topbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/tickets")}
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          ← Back
        </button>
        <span className="text-slate-700">|</span>
        <span className="text-xs text-slate-500 font-mono">{ticket.id}</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Ticket Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-lg font-bold text-white">{ticket.title}</h1>
            <span
              className={`px-2 py-0.5 rounded text-xs shrink-0 ${STATUS_STYLE[ticket.status]}`}
            >
              {ticket.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {ticket.description}
          </p>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4 mb-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Priority
              </p>
              <p className={`font-medium ${PRIORITY_STYLE[ticket.priority]}`}>
                {ticket.priority}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Critical
              </p>
              {ticket.criticalValue ? (
                <span
                  className={`px-2 py-0.5 rounded text-xs ${CRITICAL_STYLE[ticket.criticalValue]}`}
                >
                  {ticket.criticalValue}
                </span>
              ) : (
                <p className="text-slate-600">—</p>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Category
              </p>
              <p className="text-slate-200">{ticket.category}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Created
              </p>
              <p className="text-slate-400">{formatDate(ticket.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Expected
              </p>
              <p className="text-slate-400">
                {formatDate(ticket.expectedCompletionAt)}
              </p>
            </div>
            {ticket.completedAt && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                  Completed
                </p>
                <p className="text-emerald-400">
                  {formatDate(ticket.completedAt)}
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 mb-6" />

          {/* Level & Assignment */}
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Current Level
              </p>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-mono">
                {ticket.currentLevel}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Assigned To
              </p>
              {ticket.assignedTo ? (
                <div>
                  <p className="text-slate-200">{ticket.assignedTo.name}</p>
                  <p className="text-xs text-slate-500">
                    {ticket.assignedTo.role.name}
                  </p>
                </div>
              ) : (
                <p className="text-slate-600">Unassigned</p>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Created By
              </p>
              <div>
                <p className="text-slate-200">{ticket.createdBy.name}</p>
                <p className="text-xs text-slate-500">
                  {ticket.createdBy.role.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">
            Activity Log
          </h2>

          {logs.length === 0 ? (
            <p className="text-slate-600 text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <div className="w-px flex-1 bg-slate-800 mt-1" />
                  </div>
                  {/* Log content */}
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-300 capitalize">
                        {log.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">
                        {log.performedByRole}
                      </span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-600">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    {log.note && (
                      <p className="text-sm text-slate-400">{log.note}</p>
                    )}
                    {log.fromStatus && log.toStatus && (
                      <p className="text-xs text-slate-500">
                        Status: {log.fromStatus} → {log.toStatus}
                      </p>
                    )}
                    {log.fromLevel && log.toLevel && (
                      <p className="text-xs text-slate-500">
                        Level: {log.fromLevel} → {log.toLevel}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
