import type { ITicket } from "../../types/ticket";

export default function UpdateTicketSummaryCard({ ticket }: { ticket: ITicket }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Ticket</p>
      <p className="text-white font-semibold">{ticket.title}</p>
      <p className="text-slate-500 text-xs mt-1">
        {ticket.category} · {ticket.priority} · {ticket.status}
      </p>
      {ticket.criticalValue && (
        <p className="text-xs mt-1 text-slate-500">
          Critical: <span className="text-red-400 font-semibold">{ticket.criticalValue}</span>
        </p>
      )}
    </div>
  );
}
