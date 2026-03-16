import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UpdateTicketSkeleton from "./UpdateTicketSkeleton";
import { ticketService } from "../../services/ticket";
import { userService } from "../../services/user";
import type { ITicket } from "../../types/ticket";
import type { IAuthUser } from "../../types/user";
import UpdateTicketEscalateForm from "./UpdateTicketEscalateForm";
import UpdateTicketStatusForm from "./UpdateTicketStatusForm";
import UpdateTicketSummaryCard from "./UpdateTicketSummaryCard";
import UpdateTopbar from "./UpdateTicketTopbar";
import PageError from "../../components/ui/PageError";
import { ENV } from "../../config/env";

export default function UpdateStatusPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [l2Users, setL2Users] = useState<IAuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const fetchData = async (ticketId: string) => {
    setLoading(true);
    try {
      const [ticketRes, usersRes] = await Promise.all([
        ticketService.getById(ticketId),
        userService.getByLevel("L2"),
        new Promise((resolve) => setTimeout(resolve, ENV.MIN_LOADING_TIMEOUT)),
      ]);
      setTicket(ticketRes.data);
      setL2Users(usersRes.data);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <UpdateTicketSkeleton />;

  if (!ticket) return <PageError message="Ticket not found." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <UpdateTopbar ticket={ticket} />

      <main className="max-w-xl mx-auto px-6 py-8 space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <UpdateTicketSummaryCard ticket={ticket} />

        <UpdateTicketStatusForm ticketId={ticket.id} initialStatus={ticket.status} />

        {ticket.status === "Attending" && (
          <UpdateTicketEscalateForm ticketId={ticket.id} toLevel="L2" users={l2Users} />
        )}
      </main>
    </div>
  );
}
