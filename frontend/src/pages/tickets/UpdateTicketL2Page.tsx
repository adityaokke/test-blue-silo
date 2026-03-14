import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CriticalValue, ITicket, Status } from "../../types/ticket";
import { ticketService } from "../../services/ticket";
import { userService } from "../../services/user";
import type { IAuthUser } from "../../types/user";
import { STATUSES } from "../../constants/ticket";

const CRITICAL_VALUES = [
  { code: "C1", label: "C1 - System Down" },
  { code: "C2", label: "C2 - Partial Issue" },
  { code: "C3", label: "C3 - Minor Problem" },
] as const;

export default function UpdateTicketL2Page() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [l3Users, setL3Users] = useState<IAuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ─── Assign critical value ────────────────────────────────────────
  const [criticalValue, setCriticalValue] = useState<CriticalValue | null>(
    null,
  );
  const [criticalNote, setCriticalNote] = useState("");

  // ─── Escalate ─────────────────────────────────────────────────────
  const [escalate, setEscalate] = useState(false);
  const [escalateNote, setEscalateNote] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // ─── Update status ───────────────────────────────────────────────
  const [status, setStatus] = useState<ITicket["status"]>("New");
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const fetchData = async (ticketId: string) => {
    setLoading(true);
    try {
      const [ticketRes, usersRes] = await Promise.all([
        ticketService.getById(ticketId),
        userService.getByLevel("L3"),
      ]);
      setTicket(ticketRes.data);
      setCriticalValue(ticketRes.data.criticalValue || null);
      setL3Users(usersRes.data);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCritical = async () => {
    if (!id || !criticalValue) return;
    setSubmitting(true);
    setError("");
    try {
      await ticketService.assignCriticalValue(id, {
        criticalValue,
        note: criticalNote,
      });
      navigate(`/tickets/${id}`);
    } catch {
      setError("Failed to assign critical value.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    if (!id || !escalateNote || !assignedTo) return;
    setSubmitting(true);
    setError("");
    try {
      await ticketService.escalate(id, {
        note: escalateNote,
        assignedTo,
      });
      navigate(`/tickets/${id}`);
    } catch {
      setError("Failed to escalate ticket.");
    } finally {
      setSubmitting(false);
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
        <span className="text-xs text-slate-400">L2 Update</span>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Ticket summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            Ticket
          </p>
          <p className="text-white font-semibold">{ticket.title}</p>
          <p className="text-slate-500 text-xs mt-1">
            {ticket.category} · {ticket.priority} · {ticket.status}
          </p>
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
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Note{" "}
              <span className="text-slate-600 normal-case">(optional)</span>
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

        {/* Assign Critical Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            Assign Critical Value
          </p>

          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Critical Value <span className="text-red-500">*</span>
            </label>
            <select
              value={criticalValue || ""}
              onChange={(e) =>
                setCriticalValue(e.target.value as CriticalValue)
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            >
              <option value="" disabled>
                Select...
              </option>
              {CRITICAL_VALUES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Note{" "}
              <span className="text-slate-600 normal-case">(optional)</span>
            </label>
            <textarea
              value={criticalNote}
              onChange={(e) => setCriticalNote(e.target.value)}
              placeholder="Add a note about this critical value..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleAssignCritical}
            disabled={submitting || !criticalValue}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Assigning..." : "Assign Critical Value"}
          </button>
        </div>

        {/* Escalate to L3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
              Escalate to L3
            </p>
            <button
              onClick={() => setEscalate(!escalate)}
              className="text-xs text-sky-500 hover:text-sky-400 transition-colors"
            >
              {escalate ? "Cancel" : "Escalate"}
            </button>
          </div>

          {escalate && (
            <>
              <div>
                <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                >
                  <option value="" disabled>
                    Select L3 agent...
                  </option>
                  {l3Users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
                  Escalation Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={escalateNote}
                  onChange={(e) => setEscalateNote(e.target.value)}
                  placeholder="Reason for escalation to L3..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleEscalate}
                disabled={submitting || !escalateNote || !assignedTo}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                {submitting ? "Escalating..." : "Escalate to L3"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
