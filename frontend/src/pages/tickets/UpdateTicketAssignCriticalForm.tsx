import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CriticalValue } from "../../types/ticket";
import { ticketService } from "../../services/ticket";

const CRITICAL_VALUES = [
  { code: "C1", label: "C1 — System Down" },
  { code: "C2", label: "C2 — Partial Issue" },
  { code: "C3", label: "C3 — Minor Problem" },
] as const;

interface Props {
  ticketId: string;
  initialValue?: CriticalValue | null;
}

export default function UpdateTicketAssignCriticalForm({ ticketId, initialValue }: Props) {
  const navigate = useNavigate();

  const [criticalValue, setCriticalValue] = useState<CriticalValue | "">(
    initialValue ?? ""
  );
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!criticalValue) return;
    setSubmitting(true);
    setError("");
    try {
      await ticketService.assignCriticalValue(ticketId, {
        criticalValue,
        note: note,
      });
      navigate(`/tickets/${ticketId}`);
    } catch {
      setError("Failed to assign critical value.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
        Assign Critical Value
      </p>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Critical Value */}
      <div>
        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
          Critical Value <span className="text-red-500">*</span>
        </label>
        <select
          value={criticalValue}
          onChange={(e) => setCriticalValue(e.target.value as CriticalValue)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
        >
          <option value="" disabled>Select...</option>
          {CRITICAL_VALUES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">
          Note{" "}
          <span className="text-slate-600 normal-case">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about this critical value..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !criticalValue}
        className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        {submitting ? "Assigning..." : "Assign Critical Value"}
      </button>
    </div>
  );
}