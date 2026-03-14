import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ITicket, Status } from "../../types/ticket";
import { ticketService } from "../../services/ticket";
import { STATUSES } from "../../constants/ticket";

export default function UpdateTicketL3Page() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ─── Update status ────────────────────────────────────────────────
  const [status, setStatus] = useState<Status>("New");
  const [statusNote, setStatusNote] = useState("");

  // ─── Resolve ──────────────────────────────────────────────────────
//   const [resolveNote, setResolveNote] = useState("");

  useEffect(() => {
    if (id) fetchTicket(id);
  }, [id]);

  const fetchTicket = async (ticketId: string) => {
    setLoading(true);
    try {
      const res = await ticketService.getById(ticketId);
      setTicket(res.data);
      setStatus(res.data.status);
    } catch {
      setError("Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!id) return;
    setSubmitting(true);
    setError("");
    try {
      await ticketService.updateStatus(id, {
        status,
        note: statusNote,
      });
      navigate(`/tickets/${id}`);
    } catch {
      setError("Failed to update status.");
    } finally {
      setSubmitting(false);
    }
  };

//   const handleResolve = async () => {
//     if (!id || !resolveNote) return;
//     setSubmitting(true);
//     setError("");
//     try {
//       await ticketService.resolve(id, { note: resolveNote });
//       navigate(`/tickets/${id}`);
//     } catch {
//       setError("Failed to resolve ticket.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 text-sm">Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* Topbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(`/tickets/${id}`)}
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          ← Back
        </button>
        <span className="text-slate-700">|</span>
        <span className="text-xs text-slate-500 font-mono">{ticket.id}</span>
        <span className="text-slate-700">|</span>
        <span className="text-xs text-slate-400">L3 Update</span>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-5">

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Ticket summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Ticket</p>
          <p className="text-white font-semibold">{ticket.title}</p>
          <p className="text-slate-500 text-xs mt-1">
            {ticket.category} · {ticket.priority} · {ticket.status}
          </p>
          {ticket.criticalValue && (
            <p className="text-xs mt-1">
              Critical:{" "}
              <span className="text-red-400 font-semibold">
                {ticket.criticalValue}
              </span>
            </p>
          )}
        </div>

        {/* Update Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            Update Status
          </p>

          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Note <span className="text-slate-600 normal-case">(optional)</span>
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Add a note about this status change..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleUpdateStatus}
            disabled={submitting}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Updating..." : "Update Status"}
          </button>
        </div>

        {/* Resolve Ticket */}
        {/* <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            Resolve Ticket
          </p>
          <p className="text-xs text-slate-500">
            Resolving will mark this ticket as completed and close it permanently.
          </p>

          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Resolution Note <span className="text-red-500">*</span>
            </label>
            <textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              placeholder="Describe how the issue was resolved..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleResolve}
            disabled={submitting || !resolveNote}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Resolving..." : "Resolve Ticket"}
          </button>
        </div> */}

      </main>
    </div>
  );
}