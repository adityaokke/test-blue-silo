import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IAuthUser } from "../../types/user";
import type { Level } from "../../types/ticket";
import { ticketService } from "../../services/ticket";

interface Props {
  ticketId: string;
  toLevel: Level;
  users: IAuthUser[];
}

export default function UpdateTicketEscalateForm({ ticketId, toLevel, users }: Props) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleEscalate = async () => {
    if (!note || !assignedTo) return;
    setSubmitting(true);
    setError("");
    try {
      await ticketService.escalate(ticketId, { note, assignedTo });
      navigate(`/tickets/${ticketId}`);
    } catch {
      setError("Failed to escalate ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
          Escalate to {toLevel}
        </p>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-sky-500 hover:text-sky-400 transition-colors"
        >
          {open ? "Cancel" : "Escalate"}
        </button>
      </div>

      {open && (
        <>
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Assign To */}
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
                Select {toLevel} agent...
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
              Escalation Note <span className="text-red-500">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Reason for escalation to ${toLevel}...`}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleEscalate}
            disabled={submitting || !note || !assignedTo}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Escalating..." : `Escalate to ${toLevel}`}
          </button>
        </>
      )}
    </div>
  );
}
