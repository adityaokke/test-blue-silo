import { useNavigate } from "react-router-dom";
import type { ITicket } from "../../types/ticket";

export default function UpdateTopbar({ ticket }: { ticket: ITicket }) {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
      <button
        onClick={() => navigate(`/tickets/${ticket.id}`)}
        className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
      >
        Back
      </button>
      <span className="text-slate-700">|</span>
      <span className="text-xs text-slate-500 font-mono">{ticket.id}</span>
      <span className="text-slate-700">|</span>
      <span className="text-xs text-slate-400">{ticket.currentLevel} Update</span>
    </header>
  );
}
