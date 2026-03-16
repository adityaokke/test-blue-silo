import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketService } from "../../services/ticket";
import type { Status } from "../../types/ticket";
import { STATUSES } from "../../constants/ticket";

interface Props {
  ticketId: string;
  initialStatus: Status;
}

export default function UpdateTicketStatusForm({ ticketId, initialStatus }: Props) {
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>(initialStatus);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await ticketService.updateStatus(ticketId, { status, note });
      navigate(`/tickets/${ticketId}`);
    } catch {
      setError("Failed to update status.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Update Status</p>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
        >
          {STATUSES.filter((s) => {
            // only allow valid next statuses based on current status
            if (initialStatus === "New") return s === "Attending";
            if (initialStatus === "Attending") return s === "Completed";
            return false;
          }).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
          Note <span className="text-slate-600 normal-case">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about this status change..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        {submitting ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}
